package user

import (
	"context"
	"fmt"
	"health-app/db"
)

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
