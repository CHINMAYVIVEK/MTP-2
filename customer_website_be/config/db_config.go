package config

import (
	"context"
	"fmt"
	"log"

	"github.com/caarlos0/env/v11"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresDB represents a PostgreSQL database connection manager
type PostgresDB struct {
	config *PSQLConfig
	pool   *pgxpool.Pool
}

// NewPostgresDB creates a new PostgresDB instance
func NewPostgresDB(config *PSQLConfig) *PostgresDB {
	return &PostgresDB{
		config: config,
	}
}

// Load loads the PSQLConfig from environment variables
func (p *PSQLConfig) Load() error {
	if err := env.Parse(p); err != nil {
		return fmt.Errorf("failed to parse postgres config: %w", err)
	}
	return nil
}

// Connect establishes a connection to PostgreSQL using pgxpool
func (p *PostgresDB) Connect(ctx context.Context) error {
	if p.config.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}

	// Parse config to set pool parameters
	poolConfig, err := pgxpool.ParseConfig(p.config.DatabaseURL)
	if err != nil {
		return fmt.Errorf("failed to parse database URL: %w", err)
	}

	// Configure connection pool for concurrent calls
	poolConfig.MaxConns = int32(p.config.MaxOpenConns)
	poolConfig.MinConns = int32(p.config.MaxIdleConns)
	if p.config.ConnMaxLifetime > 0 {
		poolConfig.MaxConnLifetime = p.config.ConnMaxLifetime
	}
	if p.config.ConnMaxIdleTime > 0 {
		poolConfig.MaxConnIdleTime = p.config.ConnMaxIdleTime
	}

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test the connection
	if err = pool.Ping(ctx); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	p.pool = pool
	log.Printf("✅ Database connection established successfully")
	log.Printf("   - Max Connections: %d", poolConfig.MaxConns)
	log.Printf("   - Min Connections: %d", poolConfig.MinConns)
	log.Printf("   - Connection Lifetime: %v", poolConfig.MaxConnLifetime)
	return nil
}

// GetPool returns the database connection pool
func (p *PostgresDB) GetPool() (*pgxpool.Pool, error) {
	if p.pool == nil {
		return nil, fmt.Errorf("database connection not initialized, call Connect() first")
	}
	return p.pool, nil
}

// Close safely closes the database connection pool
func (p *PostgresDB) Close() error {
	if p.pool != nil {
		p.pool.Close()
		p.pool = nil
	}
	return nil
}
