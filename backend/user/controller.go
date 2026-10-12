package user

import (
	"health-app/logs"
	"health-app/utils"
	"net/http"
)

type Controller struct {
	svc    *Service
	logger *logs.Logger
}

func NewController(svc *Service, log *logs.Logger) *Controller {
	return &Controller{svc: svc, logger: log}
}

func (c *Controller) list(w http.ResponseWriter, r *http.Request) {
	users, err := c.svc.ListUsers(r.Context())
	if err != nil {
		c.logger.Error("list users", "err", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, users, c.logger)

}

func (c *Controller) setup() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", c.list)
	return mux
}

func (c *Controller) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c.setup().ServeHTTP(w, r)
}
