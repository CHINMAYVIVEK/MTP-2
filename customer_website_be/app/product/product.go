package product

import (
	"context"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"
)

// ProductService handles product business logic (Service Layer)
type ProductService struct {
	repo *ProductRepository
}

// NewService creates a new ProductService instance
func NewService(db *config.PostgresDB) *ProductService {
	repo := NewRepository(db)
	return &ProductService{repo: repo}
}

// ListProductsPage retrieves products with pagination and applies business logic
func (s *ProductService) ListProductsPage(ctx context.Context, limit, offset int) ([]domain.Product, error) {
	products, err := s.repo.ListProductsPage(ctx, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to list products: %w", err)
	}

	for i := range products {
		s.applyProductDiscount(&products[i])
	}

	return products, nil
}

// GetProductByID retrieves a single product by ID with business logic
func (s *ProductService) GetProductByID(ctx context.Context, id string) (*domain.Product, error) {
	if id == "" {
		return nil, fmt.Errorf("product ID is required")
	}

	product, err := s.repo.GetProductByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product: %w", err)
	}
	if product == nil {
		return nil, fmt.Errorf("product not found")
	}

	s.applyProductDiscount(product)
	return product, nil
}

// applyProductDiscount adjusts pricing if a discount is present
func (s *ProductService) applyProductDiscount(p *domain.Product) {
	if p.DiscountPrice > 0 && p.DiscountPrice < p.Price {
		p.Price = p.DiscountPrice
	} else {
		p.Price = p.Price
	}
}

// GetProductsByStoreUser retrieves products for a specific store user with pagination
func (s *ProductService) GetProductsByStoreUser(ctx context.Context, storeUserID string, limit, offset int) ([]domain.Product, error) {
	if storeUserID == "" {
		return nil, fmt.Errorf("store user ID is required")
	}

	products, err := s.repo.GetProductsByStoreUser(ctx, storeUserID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get store products: %w", err)
	}

	for i := range products {
		s.applyProductDiscount(&products[i])
	}

	return products, nil
}
