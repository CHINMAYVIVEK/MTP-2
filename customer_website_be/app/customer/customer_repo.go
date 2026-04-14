package customer

import (
	"context"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type CustomerRepository struct {
	db *config.PostgresDB
}

func NewRepository(db *config.PostgresDB) *CustomerRepository {
	return &CustomerRepository{db: db}
}

// CreateCustomer inserts a new customer
func (r *CustomerRepository) CreateCustomer(ctx context.Context, c *domain.Customer) error {
	pool, err := r.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	query := `
		INSERT INTO customers (first_name, last_name, email, phone, avatar_url, addresses, password)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`

	err = pool.QueryRow(ctx, query,
		c.FirstName, c.LastName, c.Email, c.Phone, c.AvatarURL, c.Addresses, c.Password,
	).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return fmt.Errorf("create customer: %w", err)
	}

	return nil
}

// GetCustomerByEmail fetches a customer by email
func (r *CustomerRepository) GetCustomerByEmail(ctx context.Context, email string) (*domain.Customer, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	var c domain.Customer
	query := `
		SELECT id, first_name, last_name, email, phone, avatar_url, addresses, password, created_at, updated_at
		FROM customers WHERE email = $1
	`
	err = pool.QueryRow(ctx, query, email).Scan(
		&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone,
		&c.AvatarURL, &c.Addresses, &c.Password, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query customer: %w", err)
	}

	return &c, nil
}

// GetCustomerByID fetches a customer by ID
func (r *CustomerRepository) GetCustomerByID(ctx context.Context, id string) (*domain.Customer, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	customerUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid customer ID: %w", err)
	}

	var c domain.Customer
	query := `
		SELECT id, first_name, last_name, email, phone, avatar_url, addresses, password, created_at, updated_at
		FROM customers WHERE id = $1
	`
	err = pool.QueryRow(ctx, query, customerUUID).Scan(
		&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone,
		&c.AvatarURL, &c.Addresses, &c.Password, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query customer: %w", err)
	}

	return &c, nil
}

// UpdateCustomer updates basic info
func (r *CustomerRepository) UpdateCustomer(ctx context.Context, c *domain.Customer) error {
	pool, err := r.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	customerUUID, err := uuid.Parse(c.ID)
	if err != nil {
		return fmt.Errorf("invalid customer ID: %w", err)
	}

	query := `
		UPDATE customers
		SET first_name=$2, last_name=$3, phone=$4, avatar_url=$5, addresses=$6, updated_at=NOW()
		WHERE id=$1 RETURNING updated_at
	`
	return pool.QueryRow(ctx, query,
		customerUUID, c.FirstName, c.LastName, c.Phone, c.AvatarURL, c.Addresses,
	).Scan(&c.UpdatedAt)
}

// DeleteCustomer deletes a customer
func (r *CustomerRepository) DeleteCustomer(ctx context.Context, id uuid.UUID) error {
	pool, err := r.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	_, err = pool.Exec(ctx, `DELETE FROM customers WHERE id=$1`, id)
	return err
}
