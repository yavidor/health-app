package user

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"health-app/db"
	"uuid"
)

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
		return nil, err
	}
	// An empty table yields a nil slice with a nil error; normalize it so the result marshals to [] rather than null.
	if len(users) == 0 {
		return []User{}, nil
	}
	return users, nil
}

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

func (s *Service) CreateUser(ctx context.Context, displayName string) error {
	return s.querier.CreateUser(ctx, db.CreateUserParams{ID: uuid.NewV4(), DisplayName: displayName})
}
