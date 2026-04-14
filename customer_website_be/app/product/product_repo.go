package product

import (
	"context"
	"encoding/json"
	"fmt"

	"qcommerce_backend/config"
	"qcommerce_backend/domain"

	"github.com/jackc/pgx/v5"
)

type ProductRepository struct {
	db *config.PostgresDB
}

const (
	defaultListLimit  = 5
	defaultListOffset = 0
)

func NewRepository(db *config.PostgresDB) *ProductRepository {
	return &ProductRepository{db: db}
}

// --- helpers ---

func defaultPagination(limit, offset int) (int, int) {
	if limit <= 0 {
		limit = defaultListLimit
	}
	if offset < 0 {
		offset = defaultListOffset
	}
	return limit, offset
}

func unmarshalAttributes(attrJSON []byte) ([]domain.ProductAttribute, error) {
	var attrs []domain.ProductAttribute
	if err := json.Unmarshal(attrJSON, &attrs); err != nil {
		return nil, fmt.Errorf("failed to unmarshal attributes: %w", err)
	}
	return attrs, nil
}

func unmarshalImages(imgJSON []byte) ([]domain.ProductImage, error) {
	if len(imgJSON) == 0 {
		return nil, nil
	}

	var images []domain.ProductImage
	if err := json.Unmarshal(imgJSON, &images); err != nil {
		return nil, fmt.Errorf("failed to unmarshal images: %w", err)
	}
	return images, nil
}

func scanProductRow(row pgx.Row) (domain.Product, error) {
	var p domain.Product
	var attrJSON, imgJSON []byte

	if err := row.Scan(
		&p.ID, &p.Name, &p.Description, &p.ShortDescription,
		&p.Price, &p.DiscountPrice, &p.Currency,
		&p.Quantity, &p.Weight, &p.StoreID,
		&attrJSON, &imgJSON,
		&p.Status, &p.CreatedAt, &p.UpdatedAt,
	); err != nil {
		return p, err
	}

	var err error
	if p.Attributes, err = unmarshalAttributes(attrJSON); err != nil {
		return p, err
	}

	if p.Images, err = unmarshalImages(imgJSON); err != nil {
		return p, err
	}

	return p, nil
}

// Helper to scan multiple rows
func scanProductsRows(rows pgx.Rows) ([]domain.Product, error) {
	defer rows.Close()
	var products []domain.Product
	for rows.Next() {
		p, err := scanProductRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan product: %w", err)
		}
		products = append(products, p)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}
	return products, nil
}

// --- repository methods ---

func (r *ProductRepository) ListProductsPage(ctx context.Context, limit, offset int) ([]domain.Product, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("failed to get db pool: %w", err)
	}

	limit, offset = defaultPagination(limit, offset)

	query := `
	SELECT id, name, description, short_description, price, discount_price,
	       currency, quantity, weight, store_id, attributes, img_urls,
	       status, created_at, updated_at
	FROM products
	WHERE status = true
	ORDER BY created_at DESC
	LIMIT $1 OFFSET $2
	`

	rows, err := pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}

	return scanProductsRows(rows)
}

func (r *ProductRepository) GetProductByID(ctx context.Context, id string) (*domain.Product, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("failed to get db pool: %w", err)
	}

	query := `
	SELECT id, name, description, short_description, price, discount_price,
	       currency, quantity, weight, store_id, attributes, img_urls,
	       status, created_at, updated_at
	FROM products
	WHERE id = $1 AND status = true
	`

	p, err := scanProductRow(pool.QueryRow(ctx, query, id))
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get product by ID: %w", err)
	}

	return &p, nil
}

func (r *ProductRepository) GetProductsByStoreUser(ctx context.Context, storeID string, limit, offset int) ([]domain.Product, error) {
	pool, err := r.db.GetPool()
	if err != nil {
		return nil, fmt.Errorf("failed to get db pool: %w", err)
	}

	limit, offset = defaultPagination(limit, offset)

	query := `
	SELECT id, name, description, short_description, price, discount_price,
	       currency, quantity, weight, store_id, attributes, img_urls,
	       status, created_at, updated_at
	FROM products
	WHERE store_id = $1 AND status = true
	ORDER BY created_at DESC
	LIMIT $2 OFFSET $3
	`

	rows, err := pool.Query(ctx, query, storeID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query store products: %w", err)
	}

	return scanProductsRows(rows)
}
