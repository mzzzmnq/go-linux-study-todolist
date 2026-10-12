package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

func testStore(t *testing.T) (*Store, Plan) {
	t.Helper()
	p, err := readPlan()
	if err != nil {
		t.Fatal(err)
	}
	s, err := newStore(filepath.Join(t.TempDir(), "state.json"), p)
	if err != nil {
		t.Fatal(err)
	}
	return s, p
}

func request(h http.Handler, method, path string, v any, origin string) *httptest.ResponseRecorder {
	var body bytes.Buffer
	if v != nil {
		_ = json.NewEncoder(&body).Encode(v)
	}
	r := httptest.NewRequest(method, "http://localhost:8787"+path, &body)
	if v != nil {
		r.Header.Set("Content-Type", "application/json")
	}
	if origin != "" {
		r.Header.Set("Origin", origin)
	}
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	return w
}

func TestCurriculumHasTwelveTwentyHourWeeks(t *testing.T) {
	p, err := readPlan()
	if err != nil {
		t.Fatal(err)
	}
	if len(p.Weeks) != 12 {
		t.Fatalf("weeks=%d", len(p.Weeks))
	}
	ids := map[string]bool{}
	for i, w := range p.Weeks {
		if w.Number != i+1 || len(w.Tasks) < 6 || w.Title == "" || w.Goal == "" {
			t.Fatalf("incomplete week: %+v", w)
		}
		minutes := 0
		for _, task := range w.Tasks {
			if ids[task.ID] || task.ID == "" {
				t.Fatalf("duplicate/empty task ID: %s", task.ID)
			}
			ids[task.ID] = true
			if !categories[task.Category] || task.Minutes <= 0 || task.Title == "" || task.Description == "" {
				t.Fatalf("invalid task: %+v", task)
			}
			minutes += task.Minutes
		}
		if minutes != 1200 {
			t.Fatalf("week %d: got %d minutes, want 1200", w.Number, minutes)
		}
	}
}

func TestAPISavesAndReloadsProgress(t *testing.T) {
	s, p := testStore(t)
	h := handler(s, p)
	state := s.snapshot()
	id := p.Weeks[0].Tasks[0].ID
	state.Tasks[id] = Progress{Done: true, Notes: "理解了切片，明天再练一次。", ActualMinutes: 75}
	state.CustomTasks = []CustomTask{{ID: "custom-practice", Title: "复习命令", Category: "Linux", Minutes: 30, WeekID: p.Weeks[0].ID, Description: "练习 grep"}}
	w := request(h, http.MethodPut, "/api/state", state, "http://localhost:8787")
	if w.Code != 200 {
		t.Fatalf("%d: %s", w.Code, w.Body.String())
	}
	loaded, err := newStore(s.path, p)
	if err != nil {
		t.Fatal(err)
	}
	saved := loaded.snapshot()
	if saved.Revision != 1 || saved.UpdatedAt == "" || saved.Tasks[id] != state.Tasks[id] || len(saved.CustomTasks) != 1 {
		t.Fatalf("did not persist: %+v", saved)
	}
	if got := request(h, http.MethodGet, "/api/state", nil, ""); got.Code != 200 {
		t.Fatal(got.Code)
	}
}

func TestConcurrentTabsCannotOverwrite(t *testing.T) {
	s, p := testStore(t)
	h := handler(s, p)
	initial := s.snapshot()
	var wg sync.WaitGroup
	results := make(chan int, 2)
	for i := 0; i < 2; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); results <- request(h, http.MethodPut, "/api/state", initial, "").Code }()
	}
	wg.Wait()
	close(results)
	counts := map[int]int{}
	for status := range results {
		counts[status]++
	}
	if counts[200] != 1 || counts[409] != 1 {
		t.Fatalf("unexpected statuses: %v", counts)
	}
}

func TestFailedSavePreservesMemoryAndDisk(t *testing.T) {
	s, p := testStore(t)
	first := s.snapshot()
	if _, err := s.update(first); err != nil {
		t.Fatal(err)
	}
	before, err := os.ReadFile(s.path)
	if err != nil {
		t.Fatal(err)
	}
	s.save = func(string, State) error { return errors.New("simulated disk failure") }
	next := s.snapshot()
	next.Tasks[p.Weeks[0].Tasks[0].ID] = Progress{Done: true}
	if _, err := s.update(next); err == nil {
		t.Fatal("expected error")
	}
	after, _ := os.ReadFile(s.path)
	if !bytes.Equal(before, after) || s.snapshot().Revision != 1 || len(s.snapshot().Tasks) != 0 {
		t.Fatal("failed write changed saved data")
	}
}

func TestInvalidImportDoesNotReplaceState(t *testing.T) {
	s, p := testStore(t)
	h := handler(s, p)
	cases := map[string]func(*State){
		"date":             func(s *State) { s.StartDate = "2026-02-30" },
		"unknown task":     func(s *State) { s.Tasks["unknown"] = Progress{} },
		"negative minutes": func(s *State) { s.Tasks[p.Weeks[0].Tasks[0].ID] = Progress{ActualMinutes: -1} },
		"long notes":       func(s *State) { s.Tasks[p.Weeks[0].Tasks[0].ID] = Progress{Notes: strings.Repeat("字", 8001)} },
		"duplicate custom": func(s *State) {
			task := CustomTask{ID: "custom-same", Title: "a", Category: "Go", Minutes: 10, WeekID: p.Weeks[0].ID}
			s.CustomTasks = []CustomTask{task, task}
		},
	}
	for name, mutate := range cases {
		t.Run(name, func(t *testing.T) {
			state := s.snapshot()
			mutate(&state)
			w := request(h, http.MethodPut, "/api/state", state, "")
			if w.Code != 400 {
				t.Fatalf("%d: %s", w.Code, w.Body.String())
			}
			if s.snapshot().Revision != 0 {
				t.Fatal("invalid state saved")
			}
		})
	}
}

func TestRejectsCrossSiteAndDNSRebinding(t *testing.T) {
	s, p := testStore(t)
	h := handler(s, p)
	if w := request(h, http.MethodPut, "/api/state", s.snapshot(), "https://unrelated.example"); w.Code != 403 {
		t.Fatal(w.Code)
	}
	r := httptest.NewRequest(http.MethodGet, "http://unrelated.example/api/state", nil)
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	if w.Code != 403 {
		t.Fatal(w.Code)
	}
}

func TestCorruptFileIsPreserved(t *testing.T) {
	s, p := testStore(t)
	bad := []byte(`{"version":1,broken`)
	if err := os.WriteFile(s.path, bad, 0600); err != nil {
		t.Fatal(err)
	}
	if _, err := newStore(s.path, p); err == nil {
		t.Fatal("expected corrupt file error")
	}
	actual, _ := os.ReadFile(s.path)
	if !bytes.Equal(actual, bad) {
		t.Fatal("corrupt file was overwritten")
	}
}

func TestServesEmbeddedUIAndRejectsBadJSON(t *testing.T) {
	s, p := testStore(t)
	h := handler(s, p)
	for _, path := range []string{"/", "/app.js", "/styles.css", "/api/plan"} {
		w := request(h, http.MethodGet, path, nil, "")
		if w.Code != 200 {
			t.Fatalf("%s: %d", path, w.Code)
		}
	}
	r := httptest.NewRequest(http.MethodPut, "http://localhost:8787/api/state", strings.NewReader(`{} {}`))
	r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	if w.Code != 400 {
		t.Fatal(w.Code)
	}
	if w := request(h, http.MethodPost, "/api/state", s.snapshot(), ""); w.Code != 405 {
		t.Fatal(w.Code)
	}
}
