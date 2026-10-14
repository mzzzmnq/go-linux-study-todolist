package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestDetailedCurriculumKeepsExistingTaskIDsAndBudgets(t *testing.T) {
	plan, err := readPlan()
	if err != nil {
		t.Fatal(err)
	}
	if len(plan.Weeks) != 12 {
		t.Fatalf("got %d weeks, want 12", len(plan.Weeks))
	}
	for wi, week := range plan.Weeks {
		if week.ID != fmt.Sprintf("week-%02d", wi+1) || len(week.Tasks) != 8 {
			t.Fatalf("existing week identity changed: %s", week.ID)
		}
		for ti, task := range week.Tasks {
			if task.ID != fmt.Sprintf("w%02d-t%02d", wi+1, ti+1) {
				t.Fatalf("existing task identity changed: %s", task.ID)
			}
			d := task.Details
			if d == nil || strings.TrimSpace(d.Objective) == "" || len(d.Steps) < 2 || len(d.Acceptance) < 3 || len(d.Pitfalls) < 2 {
				t.Fatalf("incomplete guide: %s", task.ID)
			}
			minutes := 0
			for _, step := range d.Steps {
				if step.Minutes <= 0 || strings.TrimSpace(step.Title) == "" || len(step.Actions) < 2 {
					t.Fatalf("invalid step in %s: %+v", task.ID, step)
				}
				minutes += step.Minutes
			}
			if minutes != task.Minutes {
				t.Fatalf("%s adds learning hours: steps=%d, task=%d", task.ID, minutes, task.Minutes)
			}
			if len(d.Prerequisites) == 0 || len(d.Deliverables) < 2 || len(d.Reflection) < 2 {
				t.Fatalf("missing supporting information: %s", task.ID)
			}
			if task.Category != "求职" && task.Minutes != 60 && len(d.Resources) == 0 {
				t.Fatalf("missing technical reference: %s", task.ID)
			}
			for _, resource := range d.Resources {
				u, err := url.Parse(resource.URL)
				if err != nil || u.Scheme != "https" || u.Host == "" || resource.Label == "" {
					t.Fatalf("invalid resource for %s: %+v", task.ID, resource)
				}
			}
		}
	}
}

func TestPlanResponseIncludesDetailedSteps(t *testing.T) {
	store, _ := testStore(t)
	response := request(handler(store, store.plan), "GET", "/api/plan", nil, "")
	if response.Code != 200 {
		t.Fatalf("status=%d", response.Code)
	}
	var plan Plan
	if err := json.Unmarshal(response.Body.Bytes(), &plan); err != nil {
		t.Fatal(err)
	}
	if len(plan.Weeks) == 0 || len(plan.Weeks[0].Tasks) == 0 || plan.Weeks[0].Tasks[0].Details == nil {
		t.Fatal("detailed curriculum was dropped by the API")
	}
}

func TestPreviousProgressLoadsWithoutMigration(t *testing.T) {
	plan, err := readPlan()
	if err != nil {
		t.Fatal(err)
	}
	previous := []byte(`{"version":1,"revision":7,"startDate":"2026-10-12","tasks":{"w01-t01":{"done":true,"notes":"旧版本笔记","actualMinutes":45}},"customTasks":[{"id":"custom-practice","title":"复习命令","category":"Linux","minutes":30,"weekId":"week-01","description":"练习路径"}],"updatedAt":"2026-10-12T08:00:00Z"}`)
	path := filepath.Join(t.TempDir(), "state.json")
	if err := os.WriteFile(path, previous, 0600); err != nil {
		t.Fatal(err)
	}
	store, err := newStore(path, plan)
	if err != nil {
		t.Fatal(err)
	}
	state := store.snapshot()
	if state.Revision != 7 || !state.Tasks["w01-t01"].Done || state.Tasks["w01-t01"].Notes != "旧版本笔记" || state.Tasks["w01-t01"].ActualMinutes != 45 || len(state.CustomTasks) != 1 {
		t.Fatalf("previous progress changed: %+v", state)
	}
	after, err := os.ReadFile(path)
	if err != nil || !bytes.Equal(previous, after) {
		t.Fatal("loading detailed curriculum rewrote previous progress")
	}
}
