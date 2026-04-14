package domain

import (
	"time"
)

// Order represents a customer's order
type Order struct {
	OrderID     string          `json:"order_id"`
	CustomerID  string          `json:"customer_id,omitempty"`
	TotalAmount float64         `json:"total_amount"`
	Currency    string          `json:"currency"`
	Items       []OrderItem     `json:"items"`
	Shipping    *ShippingDetail `json:"shipping"` // optional but common
	Status      int             `json:"status"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

// OrderItem represents an individual product in an order
type OrderItem struct {
	ProductID   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	Discount    float64 `json:"discount"`
	TotalPrice  float64 `json:"total_price"`
	Currency    string  `json:"currency"`
}

// ShippingDetail holds address & delivery info
type ShippingDetail struct {
	AddressLine1 string  `json:"address_line1"`
	AddressLine2 *string `json:"address_line2,omitempty"`
	City         string  `json:"city"`
	State        string  `json:"state"`
	Country      string  `json:"country"`
	PostalCode   string  `json:"postal_code"`
	Phone        string  `json:"phone"`
}
