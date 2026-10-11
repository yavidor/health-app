package main

import (
	"context"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"health-app/db"

	_ "modernc.org/sqlite"
)

// newTestController builds the real controller over a private, migrated SQLite
// database and returns the handler under test. The database is a temp file
// rather than :memory: so it behaves like the deployed one, and it is built per
// test so each test's starting state is visible where the test is.
func newTestController(t *testing.T, staticDir string) http.Handler {
	t.Helper()
	// Keep the middleware's request logging out of the test output.
	t.Setenv("LOG_LEVEL", "ERROR")

	conn, err := sql.Open("sqlite", "file:"+filepath.Join(t.TempDir(), "test.db")+"?_pragma=foreign_keys(1)")
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}
	conn.SetMaxOpenConns(1)
	t.Cleanup(func() { conn.Close() })

	if _, err := db.Migrate(context.Background(), conn); err != nil {
		t.Fatalf("migrate test database: %v", err)
	}
	return NewController(CreateLogger(), staticDir, db.New(conn))
}

// get drives one GET through the handler and returns the recorder, so tests
// assert on what a client would see rather than on the handler's internals.
func get(handler http.Handler, target string) *httptest.ResponseRecorder {
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, target, nil))
	return rec
}

func TestControllerServesTheHelloRoute(t *testing.T) {
	handler := newTestController(t, t.TempDir())

	rec := get(handler, "/a")

	if rec.Code != http.StatusOK {
		t.Fatalf("GET /a status = %d, want %d", rec.Code, http.StatusOK)
	}
	if body := rec.Body.String(); !strings.Contains(body, "Hello World") {
		t.Errorf("GET /a body = %q, want it to contain %q", body, "Hello World")
	}
}

// The frontend build is served at the site root. Point the controller at a
// directory holding an index.html and assert the file comes back, which is the
// deployment behaviour this work must not regress.
func TestControllerServesTheFrontendBuild(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte("<html>frontend build</html>"), 0o644); err != nil {
		t.Fatalf("write index.html: %v", err)
	}
	handler := newTestController(t, dir)

	rec := get(handler, "/")

	if rec.Code != http.StatusOK {
		t.Fatalf("GET / status = %d, want %d", rec.Code, http.StatusOK)
	}
	if body := rec.Body.String(); !strings.Contains(body, "frontend build") {
		t.Errorf("GET / body = %q, want the served frontend build", body)
	}
}

func TestUnknownPathIsNotFound(t *testing.T) {
	handler := newTestController(t, t.TempDir())

	if rec := get(handler, "/no-such-thing"); rec.Code != http.StatusNotFound {
		t.Errorf("GET /no-such-thing status = %d, want %d", rec.Code, http.StatusNotFound)
	}
}

// Routes used to live on the package-global mux, so a second controller in one
// process panicked on the duplicate pattern. Building two here proves the routes
// are private to each controller rather than shared.
func TestControllersDoNotShareRoutes(t *testing.T) {
	first := newTestController(t, t.TempDir())
	second := newTestController(t, t.TempDir())

	for i, handler := range []http.Handler{first, second} {
		if rec := get(handler, "/a"); rec.Code != http.StatusOK {
			t.Errorf("controller %d: GET /a status = %d, want %d", i, rec.Code, http.StatusOK)
		}
	}
}
