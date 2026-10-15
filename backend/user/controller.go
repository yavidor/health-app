package user

import (
	"errors"
	"health-app/utils"
	"net/http"
	"strings"
)

type Controller struct {
	svc    *Service
	logger *utils.Logger
}

type UserCreateRequest struct {
	DisplayName string `json:"displayName"`
}

func (r UserCreateRequest) Validate() error {
	if strings.TrimSpace(r.DisplayName) == "" {
		return errors.New("displayName is required")
	}
	if len(r.DisplayName) > 50 {
		return errors.New("display name should be 50 characters or less")
	}
	return nil
}

func NewController(svc *Service, log *utils.Logger) *Controller {
	return &Controller{svc: svc, logger: log}
}

func (c *Controller) list(w http.ResponseWriter, r *http.Request) {
	users, err := c.svc.ListUsers(r.Context())
	if err != nil {
		c.logger.Error("list users", "err", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	err = utils.WriteJSON(w, http.StatusOK, users, c.logger)
	if err != nil {
		c.logger.Error(err.Error())
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}

}

func (c *Controller) CreateUser(w http.ResponseWriter, r *http.Request) {
	body, err := utils.ReadJSON[UserCreateRequest](r, c.logger)
	if err != nil {
		c.logger.Error(err.Error())
		http.Error(w, "Unprocessable Entity", http.StatusUnprocessableEntity)
		return
	}
	err = c.svc.CreateUser(r.Context(), body.DisplayName)
	if err != nil {
		c.logger.Error(err.Error())
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

func (c *Controller) setup() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", c.list)
	mux.HandleFunc("POST /", c.CreateUser)
	return mux
}

func (c *Controller) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c.setup().ServeHTTP(w, r)
}
