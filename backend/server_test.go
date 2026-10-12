package main

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"health-app/db"
	"health-app/logs"
)

// newTestServer builds the real controller over a private, migrated SQLite
// database and returns the handler under test. The database is a temp file
// rather than :memory: so it behaves like the deployed one, and it is built per
// test so each test's starting state is visible where the test is.
func newTestServer(t *testing.T, staticDir string) http.Handler {
	t.Helper()
	// Keep the middleware's request logging out of the test output.
	t.Setenv("LOG_LEVEL", "ERROR")

	conn, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}
	t.Cleanup(func() { conn.Close() })

	if _, err := db.Migrate(context.Background(), conn); err != nil {
		t.Fatalf("migrate test database: %v", err)
	}
	return NewServer(logs.CreateLogger(), staticDir)
}

// get drives one GET through the handler and returns the recorder, so tests
// assert on what a client would see rather than on the handler's internals.
func get(handler http.Handler, target string) *httptest.ResponseRecorder {
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, target, nil))
	return rec
}

// The frontend build is served at the site root. Point the controller at a
// directory holding an index.html and assert the file comes back, which is the
// deployment behaviour this work must not regress.
func TestServerServesTheFrontendBuild(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte("<html>frontend build</html>"), 0o644); err != nil {
		t.Fatalf("write index.html: %v", err)
	}
	handler := newTestServer(t, dir)

	rec := get(handler, "/")

	if rec.Code != http.StatusOK {
		t.Fatalf("GET / status = %d, want %d", rec.Code, http.StatusOK)
	}
	if body := rec.Body.String(); !strings.Contains(body, "frontend build") {
		t.Errorf("GET / body = %q, want the served frontend build", body)
	}
}

func TestUnknownPathIsNotFound(t *testing.T) {
	handler := newTestServer(t, t.TempDir())

	if rec := get(handler, "/no-such-thing"); rec.Code != http.StatusNotFound {
		t.Errorf("GET /no-such-thing status = %d, want %d", rec.Code, http.StatusNotFound)
	}
}

// Routes used to live on the package-global mux, so a second controller in one
// process panicked on the duplicate pattern. Building two here proves the routes
// are private to each controller rather than shared.
func TestServersDoNotShareRoutes(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte("<html>frontend build</html>"), 0o644); err != nil {
		t.Fatalf("write index.html: %v", err)
	}
	first := newTestServer(t, dir)
	second := newTestServer(t, dir)

	for i, handler := range []http.Handler{first, second} {
		if rec := get(handler, "/"); rec.Code != http.StatusOK {
			t.Errorf("server %d: GET / status = %d, want %d", i, rec.Code, http.StatusOK)
		}
	}
}
