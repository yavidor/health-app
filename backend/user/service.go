package user

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"health-app/db"
)

// ErrNotFound is returned when no User matches the lookup. Callers map it to a
// 404; no other error from this package means that.
var ErrNotFound = errors.New("user not found")

type User = db.User

type Service struct {
	querier db.Querier
}

func NewService(querier db.Querier) *Service {
	return &Service{querier}
}

func (s *Service) ListUsers(ctx context.Context) ([]User, error) {
	users, err := s.querier.GetUsers(ctx)
	if err != nil {
		return nil, fmt.Errorf("list users: %w", err)
	}
	// An empty table yields a nil slice with a nil error; normalize it so the result marshals to [] rather than null.
	if len(users) == 0 {
		return []User{}, nil
	}
	return users, nil
}

// GetUserByDisplayName returns the User with this display name, or ErrNotFound.
// It matches the querier's name because the two do the same lookup; the
// no-rows case is translated here so no caller has to know it came from SQL.
func (s *Service) GetUserByDisplayName(ctx context.Context, displayName string) (*User, error) {
	user, err := s.querier.GetUserByDisplayName(ctx, displayName)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get user %q: %w", displayName, err)
	}
	return &user, nil
}
