// Study Todo is a small local web application built with Go's standard library.
package main

import (
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"syscall"
	"time"
)

//go:embed web/* curriculum.json
var content embed.FS

type Task struct {
	ID            string       `json:"id"`
	Title         string       `json:"title"`
	Category      string       `json:"category"`
	Minutes       int          `json:"minutes"`
	Description   string       `json:"description"`
	ResourceURL   string       `json:"resourceURL"`
	ResourceLabel string       `json:"resourceLabel"`
	Details       *TaskDetails `json:"details,omitempty"`
}

type StudyStep struct {
	Title    string   `json:"title"`
	Minutes  int      `json:"minutes"`
	Actions  []string `json:"actions"`
	Commands []string `json:"commands"`
}

type StudyPitfall struct {
	Problem  string `json:"problem"`
	Solution string `json:"solution"`
}

type StudyResource struct {
	Label string `json:"label"`
	URL   string `json:"url"`
}

type TaskDetails struct {
	Objective     string          `json:"objective"`
	Prerequisites []string        `json:"prerequisites"`
	Steps         []StudyStep     `json:"steps"`
	Acceptance    []string        `json:"acceptance"`
	Deliverables  []string        `json:"deliverables"`
	Pitfalls      []StudyPitfall  `json:"pitfalls"`
	Reflection    []string        `json:"reflection"`
	Resources     []StudyResource `json:"resources"`
	Extension     []string        `json:"extension"`
}

type Week struct {
	ID     string `json:"id"`
	Number int    `json:"number"`
	Title  string `json:"title"`
	Goal   string `json:"goal"`
	Tasks  []Task `json:"tasks"`
}

type Plan struct {
	Weeks []Week `json:"weeks"`
}

type Progress struct {
	Done          bool   `json:"done"`
	Notes         string `json:"notes"`
	ActualMinutes int    `json:"actualMinutes"`
}

type CustomTask struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Category    string `json:"category"`
	Minutes     int    `json:"minutes"`
	WeekID      string `json:"weekId"`
	Description string `json:"description"`
}

type State struct {
	Version     int                 `json:"version"`
	Revision    int                 `json:"revision"`
	StartDate   string              `json:"startDate"`
	Tasks       map[string]Progress `json:"tasks"`
	CustomTasks []CustomTask        `json:"customTasks"`
	UpdatedAt   string              `json:"updatedAt"`
}

// Store serializes writes and saves a complete snapshot using a temporary file.
// Revision prevents a second browser tab from silently overwriting newer work.
type Store struct {
	mu    sync.Mutex
	path  string
	state State
	plan  Plan
	save  func(string, State) error
}

var errConflict = errors.New("学习记录已在另一个窗口更新，请刷新后重试")
var customID = regexp.MustCompile(`^custom-[a-zA-Z0-9_-]{1,100}$`)
var categories = map[string]bool{"Go": true, "Linux": true, "Git": true, "数据库": true, "项目": true, "算法": true, "求职": true, "计算机基础": true}

func readPlan() (Plan, error) {
	var p Plan
	b, err := content.ReadFile("curriculum.json")
	if err != nil {
		return p, err
	}
	err = json.Unmarshal(b, &p)
	return p, err
}

func newStore(path string, plan Plan) (*Store, error) {
	s := &Store{path: path, plan: plan, save: saveFile, state: State{
		Version: 1, StartDate: time.Now().In(time.FixedZone("Asia/Shanghai", 8*3600)).Format("2006-01-02"),
		Tasks: make(map[string]Progress), CustomTasks: []CustomTask{},
	}}
	b, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return s, nil
	}
	if err != nil {
		return nil, err
	}
	if err := decodeJSON(bytes.NewReader(b), &s.state); err != nil {
		return nil, fmt.Errorf("学习记录文件无法读取，原文件已保留：%w", err)
	}
	if err := validateState(s.state, plan); err != nil {
		return nil, fmt.Errorf("学习记录文件格式不正确，原文件已保留：%w", err)
	}
	return s, nil
}

func cloneState(s State) State {
	n := s
	n.Tasks = make(map[string]Progress, len(s.Tasks))
	for id, p := range s.Tasks {
		n.Tasks[id] = p
	}
	n.CustomTasks = append([]CustomTask{}, s.CustomTasks...)
	return n
}

func (s *Store) snapshot() State {
	s.mu.Lock()
	defer s.mu.Unlock()
	return cloneState(s.state)
}

func (s *Store) update(next State) (State, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if next.Revision != s.state.Revision {
		return State{}, errConflict
	}
	if err := validateState(next, s.plan); err != nil {
		return State{}, err
	}
	next.Revision++
	next.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
	if next.Tasks == nil {
		next.Tasks = make(map[string]Progress)
	}
	if next.CustomTasks == nil {
		next.CustomTasks = []CustomTask{}
	}
	if err := s.save(s.path, next); err != nil {
		return State{}, fmt.Errorf("保存失败，原记录未更改：%w", err)
	}
	s.state = cloneState(next)
	return cloneState(next), nil
}

func validateState(s State, p Plan) error {
	if s.Version != 1 || s.Revision < 0 || s.Revision > 1_000_000_000 {
		return errors.New("备份版本或修订号无效")
	}
	date, err := time.Parse("2006-01-02", s.StartDate)
	if err != nil || date.Year() < 2000 || date.Year() > 2100 {
		return errors.New("请选择 2000—2100 年之间的有效开始日期")
	}
	if len(s.CustomTasks) > 500 {
		return errors.New("自定义任务最多 500 个")
	}
	validWeeks := make(map[string]bool)
	validIDs := make(map[string]bool)
	for _, w := range p.Weeks {
		validWeeks[w.ID] = true
		for _, t := range w.Tasks {
			validIDs[t.ID] = true
		}
	}
	for _, t := range s.CustomTasks {
		if !customID.MatchString(t.ID) || validIDs[t.ID] {
			return errors.New("自定义任务 ID 无效或重复")
		}
		if !validWeeks[t.WeekID] || !categories[t.Category] {
			return errors.New("自定义任务的周次或分类无效")
		}
		if strings.TrimSpace(t.Title) == "" || len([]rune(t.Title)) > 120 || len([]rune(t.Description)) > 2000 {
			return errors.New("任务标题需为 1—120 字，说明不超过 2000 字")
		}
		if t.Minutes < 1 || t.Minutes > 1200 {
			return errors.New("单个自定义任务预计耗时需为 1—1200 分钟")
		}
		validIDs[t.ID] = true
	}
	for id, t := range s.Tasks {
		if !validIDs[id] {
			return errors.New("记录中存在不属于当前学习计划的任务")
		}
		if t.ActualMinutes < 0 || t.ActualMinutes > 100000 {
			return errors.New("实际学习时长需为 0—100000 分钟")
		}
		if len([]rune(t.Notes)) > 8000 {
			return errors.New("单条任务笔记不能超过 8000 字")
		}
	}
	return nil
}

func saveFile(path string, s State) error {
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return err
	}
	b, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	f, err := os.CreateTemp(filepath.Dir(path), ".state-*.tmp")
	if err != nil {
		return err
	}
	defer os.Remove(f.Name())
	if _, err = f.Write(b); err != nil {
		f.Close()
		return err
	}
	if err = f.Sync(); err != nil {
		f.Close()
		return err
	}
	if err = f.Close(); err != nil {
		return err
	}
	return os.Rename(f.Name(), path)
}

func decodeJSON(r io.Reader, v any) error {
	d := json.NewDecoder(r)
	d.DisallowUnknownFields()
	if err := d.Decode(v); err != nil {
		return err
	}
	var extra any
	if err := d.Decode(&extra); !errors.Is(err, io.EOF) {
		return errors.New("请求必须只包含一个 JSON 对象")
	}
	return nil
}

func jsonResponse(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("response: %v", err)
	}
}

func apiError(w http.ResponseWriter, status int, message string) {
	jsonResponse(w, status, map[string]string{"error": message})
}

func loopbackHost(host string) bool {
	if h, _, err := net.SplitHostPort(host); err == nil {
		host = h
	}
	host = strings.Trim(host, "[]")
	if strings.EqualFold(host, "localhost") {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && ip.IsLoopback()
}

func handler(store *Store, plan Plan) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/plan", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", "GET")
			apiError(w, 405, "仅支持 GET")
			return
		}
		jsonResponse(w, 200, plan)
	})
	mux.HandleFunc("/api/state", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			jsonResponse(w, 200, store.snapshot())
		case http.MethodPut:
			media, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
			if media != "application/json" {
				apiError(w, 415, "请使用 JSON 格式保存记录")
				return
			}
			var next State
			if err := decodeJSON(http.MaxBytesReader(w, r.Body, 2<<20), &next); err != nil {
				apiError(w, 400, "JSON 格式无效、字段不支持或文件超过 2 MB")
				return
			}
			if err := validateState(next, plan); err != nil {
				apiError(w, 400, err.Error())
				return
			}
			result, err := store.update(next)
			if errors.Is(err, errConflict) {
				apiError(w, 409, err.Error())
				return
			}
			if err != nil {
				log.Printf("save: %v", err)
				apiError(w, 500, "保存失败，请检查数据目录权限和磁盘空间后重试")
				return
			}
			jsonResponse(w, 200, result)
		default:
			w.Header().Set("Allow", "GET, PUT")
			apiError(w, 405, "仅支持 GET 和 PUT")
		}
	})
	mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) { apiError(w, 404, "接口不存在") })
	web, _ := fs.Sub(content, "web")
	files := http.FileServer(http.FS(web))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			http.Error(w, "Method not allowed", 405)
			return
		}
		files.ServeHTTP(w, r)
	})
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'")
		w.Header().Set("Cache-Control", "no-store")
		if !loopbackHost(r.Host) {
			apiError(w, 403, "本应用仅允许本机访问")
			return
		}
		if origin := r.Header.Get("Origin"); origin != "" {
			u, err := url.Parse(origin)
			if err != nil || u.Host != r.Host || (u.Scheme != "http" && u.Scheme != "https") {
				apiError(w, 403, "拒绝跨站请求")
				return
			}
		}
		mux.ServeHTTP(w, r)
	})
}

func main() {
	addr := os.Getenv("STUDY_ADDR")
	if addr == "" {
		addr = "127.0.0.1:8787"
	}
	host, _, err := net.SplitHostPort(addr)
	if err != nil || !loopbackHost(host) {
		log.Fatal("STUDY_ADDR 必须是本机回环地址，例如 127.0.0.1:8787")
	}
	dir := os.Getenv("STUDY_DATA_DIR")
	if dir == "" {
		dir = "data"
	}
	plan, err := readPlan()
	if err != nil {
		log.Fatal(err)
	}
	store, err := newStore(filepath.Join(dir, "state.json"), plan)
	if err != nil {
		log.Fatal(err)
	}
	// Persist the first start date, even if the user has not checked any tasks yet.
	if _, err := os.Stat(store.path); errors.Is(err, os.ErrNotExist) {
		if err := saveFile(store.path, store.state); err != nil {
			log.Fatal(err)
		}
	}
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatal(err)
	}
	server := &http.Server{Handler: handler(store, plan), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-ctx.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = server.Shutdown(shutdown)
	}()
	log.Printf("学习 TodoList: http://%s", listener.Addr())
	abs, _ := filepath.Abs(store.path)
	log.Printf("学习记录保存在 %s；按 Ctrl+C 停止服务", abs)
	if err := server.Serve(listener); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
