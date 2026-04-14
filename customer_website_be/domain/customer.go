package domain

import (
	"time"
)

// Customer represents a user/customer in the system
type Customer struct {
	ID        string         `json:"id"`
	FirstName string         `json:"first_name"`
	LastName  string         `json:"last_name"`
	Email     string         `json:"email"`
	Phone     string         `json:"phone"`
	AvatarURL *string        `json:"avatar_url,omitempty"`
	Addresses map[string]any `json:"addresses,omitempty"`
	Password  string         `json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}
