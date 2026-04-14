package domain

import (
	"time"
)

// Product represents an item in the catalog
type Product struct {
	ID               string             `json:"id"`
	Name             string             `json:"name"`
	Description      string             `json:"description,omitempty"`
	ShortDescription string             `json:"short_description,omitempty"`
	Price            float64            `json:"price"`
	DiscountPrice    float64            `json:"discount_price,omitempty"`
	Currency         string             `json:"currency"`
	Quantity         int                `json:"quantity"`
	Weight           string             `json:"weight,omitempty"`
	StoreID          string             `json:"store_id,omitempty"`
	Attributes       []ProductAttribute `json:"attributes"`
	Images           []ProductImage     `json:"images"`
	Status           bool               `json:"status,omitempty"`
	CreatedAt        time.Time          `json:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at"`
}

// ProductAttribute represents a typed product property (e.g., color, size)
type ProductAttribute struct {
	Name  string `json:"attrName"`  // e.g., "Color"
	Value string `json:"attrValue"` // e.g., "Red"

}

// ProductImage represents a product image
type ProductImage struct {
	URL     string `json:"url"`
	AltText string `json:"alt_text,omitempty"`
	Primary bool   `json:"primary,omitempty"`
}
