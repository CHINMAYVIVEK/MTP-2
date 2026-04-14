package order

import (
	"context"
	"encoding/json"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"
)

// OrderService handles business logic for orders
type OrderService struct {
	repo *OrderRepository
}

// NewService creates a new OrderService instance
func NewService(db *config.PostgresDB) *OrderService {
	repo := NewRepository(db)
	return &OrderService{repo: repo}
}

// CreateOrder creates a new order for a user
func (s *OrderService) CreateOrder(ctx context.Context, o *domain.Order) (*domain.Order, error) {
	if o == nil {
		return nil, fmt.Errorf("order cannot be nil")
	}
	if o.CustomerID == "" || len(o.Items) == 0 {
		return nil, fmt.Errorf("order must include customer_id and items")
	}

	// Calculate total amount if not provided
	if o.TotalAmount == 0 {
		total := 0.0
		for _, item := range o.Items {
			total += item.TotalPrice
		}
		o.TotalAmount = total
	}

	// Default order properties
	if o.Status == 0 {
		o.Status = 1 // e.g., 1 = Pending
	}
	if o.Currency == "" {
		o.Currency = "INR"
	}

	// Marshal items into JSON for DB storage
	itemsJSON, err := json.Marshal(o.Items)
	if err != nil {
		return nil, fmt.Errorf("marshal items: %w", err)
	}

	// Insert into database
	order := &domain.Order{
		CustomerID:  o.CustomerID,
		TotalAmount: o.TotalAmount,
		Currency:    o.Currency,
		Status:      o.Status,
	}

	pool, err := s.repo.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	query := `
		INSERT INTO orders (customer_id, total_amount, currency, items, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING order_id, created_at, updated_at
	`
	err = pool.QueryRow(ctx, query,
		o.CustomerID, o.TotalAmount, o.Currency, itemsJSON, o.Status,
	).Scan(&order.OrderID, &order.CreatedAt, &order.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("insert order: %w", err)
	}

	order.Items = o.Items
	return order, nil
}

// GetOrdersByUser fetches all orders for a given customer
func (s *OrderService) GetOrdersByUser(ctx context.Context, customerID string, status string) ([]domain.Order, error) {
	if customerID == "" {
		return nil, fmt.Errorf("customer_id cannot be empty")
	}

	pool, err := s.repo.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	query := `
		SELECT order_id, customer_id, total_amount, currency, items, status, created_at, updated_at
		FROM orders WHERE customer_id = $1
	`
	args := []interface{}{customerID}
	if status != "" {
		query += " AND status = $2"
		args = append(args, status)
	}
	query += " ORDER BY created_at DESC"

	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query orders: %w", err)
	}
	defer rows.Close()

	var orders []domain.Order
	for rows.Next() {
		var (
			o        domain.Order
			itemsRaw []byte
		)
		if err := rows.Scan(&o.OrderID, &o.CustomerID, &o.TotalAmount, &o.Currency, &itemsRaw,
			&o.Status, &o.CreatedAt, &o.UpdatedAt); err != nil {
			return nil, err
		}
		_ = json.Unmarshal(itemsRaw, &o.Items)
		orders = append(orders, o)
	}
	return orders, nil
}

// GetOrderByID retrieves a specific order by order_id
func (s *OrderService) GetOrderByID(ctx context.Context, orderID string) (*domain.Order, error) {
	if orderID == "" {
		return nil, fmt.Errorf("order_id is required")
	}

	pool, err := s.repo.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	query := `
		SELECT order_id, customer_id, total_amount, currency, items, status, created_at, updated_at
		FROM orders WHERE order_id = $1
	`

	var (
		o        domain.Order
		itemsRaw []byte
	)
	err = pool.QueryRow(ctx, query, orderID).
		Scan(&o.OrderID, &o.CustomerID, &o.TotalAmount, &o.Currency, &itemsRaw,
			&o.Status, &o.CreatedAt, &o.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("query order: %w", err)
	}

	_ = json.Unmarshal(itemsRaw, &o.Items)
	return &o, nil
}

// UpdateOrderStatus updates the status of an order
func (s *OrderService) UpdateOrderStatus(ctx context.Context, orderID string, status string) (*domain.Order, error) {
	if orderID == "" {
		return nil, fmt.Errorf("order_id cannot be empty")
	}
	if status == "" {
		return nil, fmt.Errorf("status cannot be empty")
	}

	pool, err := s.repo.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("get db pool: %w", err)
	}

	query := `
		UPDATE orders
		SET status = $2, updated_at = NOW()
		WHERE order_id = $1
		RETURNING order_id, customer_id, total_amount, currency, items, status, created_at, updated_at
	`

	var (
		o        domain.Order
		itemsRaw []byte
	)
	err = pool.QueryRow(ctx, query, orderID, status).
		Scan(&o.OrderID, &o.CustomerID, &o.TotalAmount, &o.Currency, &itemsRaw,
			&o.Status, &o.CreatedAt, &o.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("update order: %w", err)
	}

	_ = json.Unmarshal(itemsRaw, &o.Items)
	return &o, nil
}

// CancelOrder sets the order status to "Cancelled"
func (s *OrderService) CancelOrder(ctx context.Context, orderID string) error {
	if orderID == "" {
		return fmt.Errorf("order_id cannot be empty")
	}

	pool, err := s.repo.db.GetPool()
	if err != nil {
		return fmt.Errorf("get db pool: %w", err)
	}

	_, err = pool.Exec(ctx, `
		UPDATE orders
		SET status = 'cancelled', updated_at = NOW()
		WHERE order_id = $1
	`, orderID)
	if err != nil {
		return fmt.Errorf("cancel order: %w", err)
	}

	return nil
}
