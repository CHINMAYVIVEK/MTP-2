package config

import (
	"context"
	"fmt"
)

// Config holds all application configuration and database connections
type Config struct {
	App      *AppConfig
	Postgres *PostgresDB
}

// New creates and initializes a new Config instance with all dependencies
func New(ctx context.Context) (*Config, error) {
	// Initialize AppConfig
	appConfig := &AppConfig{}
	if err := appConfig.Load(); err != nil {
		return nil, fmt.Errorf("failed to load app config: %w", err)
	}

	// Initialize PSQLConfig from environment variables
	postgresConfig := &PSQLConfig{}
	if err := postgresConfig.Load(); err != nil {
		return nil, fmt.Errorf("failed to load postgres config: %w", err)
	}

	// Create PostgresDB instance
	postgres := NewPostgresDB(postgresConfig)

	// Connect to database
	if err := postgres.Connect(ctx); err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	cfg := &Config{
		App:      appConfig,
		Postgres: postgres,
	}

	return cfg, nil
}

// Close safely closes all database connections
func (c *Config) Close(ctx context.Context) error {
	if c.Postgres != nil {
		if err := c.Postgres.Close(); err != nil {
			return fmt.Errorf("error closing PostgreSQL connection: %w", err)
		}
	}
	return nil
}
