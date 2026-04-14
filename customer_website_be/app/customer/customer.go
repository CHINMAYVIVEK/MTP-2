package customer

import (
	"context"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"

	"golang.org/x/crypto/bcrypt"
)

// CustomerService handles customer business logic
type CustomerService struct {
	repo *CustomerRepository
}

// NewService creates a new CustomerService instance
func NewService(db *config.PostgresDB) *CustomerService {
	repo := NewRepository(db)
	return &CustomerService{repo: repo}
}

// Register creates a new customer account with password hashing
func (s *CustomerService) Register(ctx context.Context, c *domain.Customer, password string) (*domain.Customer, error) {
	if c == nil {
		return nil, fmt.Errorf("customer cannot be nil")
	}
	if c.Email == "" {
		return nil, fmt.Errorf("email is required")
	}
	if password == "" {
		return nil, fmt.Errorf("password is required")
	}
	if c.FirstName == "" || c.LastName == "" {
		return nil, fmt.Errorf("first_name and last_name are required")
	}

	// Check if customer already exists
	existing, err := s.repo.GetCustomerByEmail(ctx, c.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing customer: %w", err)
	}
	if existing != nil {
		return nil, fmt.Errorf("customer with email %s already exists", c.Email)
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}
	c.Password = string(hashedPassword)

	// Create customer
	if err := s.repo.CreateCustomer(ctx, c); err != nil {
		return nil, fmt.Errorf("failed to create customer: %w", err)
	}

	// Clear password from response
	c.Password = ""
	return c, nil
}

// Login authenticates a customer by email and password
func (s *CustomerService) Login(ctx context.Context, email, password string) (*domain.Customer, error) {
	if email == "" {
		return nil, fmt.Errorf("email is required")
	}
	if password == "" {
		return nil, fmt.Errorf("password is required")
	}

	// Get customer by email
	customer, err := s.repo.GetCustomerByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer: %w", err)
	}
	if customer == nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(password)); err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Clear password from response
	customer.Password = ""
	return customer, nil
}

// UpdateCustomer updates customer information (partial update - only updates provided fields)
// The Customer struct passed should only have fields set that were provided in the request
func (s *CustomerService) UpdateCustomer(ctx context.Context, c *domain.Customer) (*domain.Customer, error) {
	if c == nil {
		return nil, fmt.Errorf("customer cannot be nil")
	}
	if c.ID == "" {
		return nil, fmt.Errorf("customer ID is required")
	}

	// Get existing customer
	existing, err := s.repo.GetCustomerByID(ctx, c.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer: %w", err)
	}
	if existing == nil {
		return nil, fmt.Errorf("customer not found")
	}

	// Merge existing data with update data
	// Start with existing values, then override only with provided fields
	merged := &domain.Customer{
		ID:        existing.ID,
		Email:     existing.Email, // Email should not be updated
		Password:  existing.Password,
		CreatedAt: existing.CreatedAt,
		FirstName: existing.FirstName,
		LastName:  existing.LastName,
		Phone:     existing.Phone,
		AvatarURL: existing.AvatarURL,
		Addresses: existing.Addresses,
	}

	// Only update fields that were provided (non-empty for strings, non-nil for pointers/maps)
	// Note: This approach means empty strings won't clear fields, only non-empty values will update
	if c.FirstName != "" {
		merged.FirstName = c.FirstName
	}
	if c.LastName != "" {
		merged.LastName = c.LastName
	}
	if c.Phone != "" {
		merged.Phone = c.Phone
	}
	if c.AvatarURL != nil {
		merged.AvatarURL = c.AvatarURL
	}
	if c.Addresses != nil {
		merged.Addresses = c.Addresses
	}

	// Update customer with merged data
	if err := s.repo.UpdateCustomer(ctx, merged); err != nil {
		return nil, fmt.Errorf("failed to update customer: %w", err)
	}

	// Get updated customer
	updated, err := s.repo.GetCustomerByID(ctx, c.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get updated customer: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("customer not found after update")
	}

	// Clear password from response
	updated.Password = ""
	return updated, nil
}

// GetProfile retrieves a customer's profile by ID
func (s *CustomerService) GetProfile(ctx context.Context, customerID string) (*domain.Customer, error) {
	if customerID == "" {
		return nil, fmt.Errorf("customer ID is required")
	}

	customer, err := s.repo.GetCustomerByID(ctx, customerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer: %w", err)
	}
	if customer == nil {
		return nil, fmt.Errorf("customer not found")
	}

	// Clear password from response
	customer.Password = ""
	return customer, nil
}
