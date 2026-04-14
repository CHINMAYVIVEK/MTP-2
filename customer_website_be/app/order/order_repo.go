package order

import (
	"context"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"

	"github.com/google/uuid"
)

type OrderRepository struct {
	db *config.PostgresDB
}

func NewRepository(db *config.PostgresDB) *OrderRepository {
	return &OrderRepository{db: db}
}

// CreateOrder inserts a new order
func (r *OrderRepository) CreateOrder(ctx context.Context, o *domain.Order) error {
	pool, err := r.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	query := `
		INSERT INTO orders (customer_id, total_amount, currency, items, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING order_id, created_at, updated_at
	`
	return pool.QueryRow(ctx, query,
		o.CustomerID, o.TotalAmount, o.Currency, o.Items, o.Status,
	).Scan(&o.OrderID, &o.CreatedAt, &o.UpdatedAt)
}

// GetOrdersByCustomer fetches orders for a customer
func (r *OrderRepository) GetOrdersByCustomer(ctx context.Context, customerID uuid.UUID) ([]domain.Order, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	query := `
		SELECT order_id, customer_id, total_amount, currency, items, status, created_at, updated_at
		FROM orders WHERE customer_id = $1
		ORDER BY created_at DESC
	`

	rows, err := pool.Query(ctx, query, customerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []domain.Order
	for rows.Next() {
		var o domain.Order
		if err := rows.Scan(&o.OrderID, &o.CustomerID, &o.TotalAmount, &o.Currency, &o.Items, &o.Status, &o.CreatedAt, &o.UpdatedAt); err != nil {
			return nil, err
		}
		orders = append(orders, o)
	}
	return orders, nil
}

// UpdateOrderStatus updates order status
func (r *OrderRepository) UpdateOrderStatus(ctx context.Context, orderID uuid.UUID, status int) error {
	pool, err := r.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	_, err = pool.Exec(ctx, `UPDATE orders SET status=$2, updated_at=NOW() WHERE order_id=$1`, orderID, status)
	return err
}
