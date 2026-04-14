package config

import (
	"fmt"
	"time"

	"github.com/caarlos0/env/v11"
)

type Environment string

const (
	EnvDevelopment Environment = "development"
	EnvProduction  Environment = "production"
	EnvStaging     Environment = "staging"
	EnvTest        Environment = "test"
)

type AppConfig struct {
	Env     Environment  `env:"ENV" envDefault:"development"`
	Server  ServerConfig `envPrefix:"SERVER_"`
	Profile ProfileConfig
}

type ServerConfig struct {
	Port         string        `env:"PORT" envDefault:"8002"`
	Host         string        `env:"HOST" envDefault:"localhost"`
	ReadTimeout  time.Duration `env:"READ_TIMEOUT" envDefault:"15s"`
	WriteTimeout time.Duration `env:"WRITE_TIMEOUT" envDefault:"15s"`
	IdleTimeout  time.Duration `env:"IDLE_TIMEOUT" envDefault:"120s"`
}

// PSQLConfig holds PostgreSQL database configuration
type PSQLConfig struct {
	DatabaseURL     string        `env:"DATABASE_URL" envDefault:"postgresql://neondb_owner:npg_mHBij7S4VqNL@ep-orange-voice-adun8lcy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"`
	MaxOpenConns    int           `env:"DB_MAX_OPEN_CONNS" envDefault:"25"`
	MaxIdleConns    int           `env:"DB_MAX_IDLE_CONNS" envDefault:"5"`
	ConnMaxLifetime time.Duration `env:"DB_CONN_MAX_LIFETIME" envDefault:"5m"`
	ConnMaxIdleTime time.Duration `env:"DB_CONN_MAX_IDLE_TIME" envDefault:"10m"`
}

type ProfileConfig struct {
	LogLevel      string
	EnableMetrics bool
	EnableTracing bool
	DebugMode     bool
}

// Load loads the AppConfig from environment variables
func (a *AppConfig) Load() error {
	if err := env.Parse(a); err != nil {
		return fmt.Errorf("failed to parse app config: %w", err)
	}

	// Set profile based on environment
	a.Profile = a.getProfileConfig(a.Env)

	return nil
}

// getProfileConfig returns profile-specific configuration based on environment
func (a *AppConfig) getProfileConfig(env Environment) ProfileConfig {
	switch env {
	case EnvProduction:
		return ProfileConfig{"info", true, true, false}
	case EnvStaging:
		return ProfileConfig{"debug", true, false, true}
	case EnvTest:
		return ProfileConfig{"debug", false, false, true}
	default:
		return ProfileConfig{"debug", false, false, true}
	}
}
