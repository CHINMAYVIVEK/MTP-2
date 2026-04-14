package main

import (
	"context"
	"log"
	"qcommerce_backend/config"
	"qcommerce_backend/server"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file from root directory
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: error loading .env file: %v", err)
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
