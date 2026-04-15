package main

import (
	"context"
	"log"
	"os"
	"qcommerce_backend/config"
	"qcommerce_backend/server"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	// Optional local development convenience:
	// In Docker/CI we expect env vars to be injected, so missing .env should be silent.
	if _, err := os.Stat(".env"); err == nil {
		if err := godotenv.Load(); err != nil {
			log.Printf("Warning: error loading .env file: %v", err)
		}
	}

	// Create context with cancellation
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Load configurations
	cfg, err := config.New(ctx)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Create and start the server
	srv := server.NewServer(cfg)

	log.Println("Server starting...")
	if err := srv.Start(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
