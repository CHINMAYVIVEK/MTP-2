package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"qcommerce_backend/config"
)

// StartServer initializes the server with configuration
type Server struct {
	server *http.Server
	mux    *http.ServeMux
	config *config.Config
	db     *config.PostgresDB
}

// NewServer creates and configures a new HTTP server instance
func NewServer(cfg *config.Config) *Server {
	mux := http.NewServeMux()
	server := &http.Server{
		Addr:         ":" + cfg.App.Server.Port,
		Handler:      mux,
		ReadTimeout:  cfg.App.Server.ReadTimeout,
		WriteTimeout: cfg.App.Server.WriteTimeout,
		IdleTimeout:  cfg.App.Server.IdleTimeout,
		ErrorLog:     log.New(os.Stderr, "server: ", log.LstdFlags|log.Lshortfile),
	}

	s := &Server{
		server: server,
		mux:    mux,
		config: cfg,
		db:     cfg.Postgres,
	}
	// Initialize routes
	s.SetupRoutes()
	return s
}

// Start begins listening for HTTP requests
func (s *Server) Start() error {
	log.Printf("Starting server on %s", s.server.Addr)

	// Setup graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-quit
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()

		log.Println("Shutting down server...")
		if err := s.Stop(shutdownCtx); err != nil {
			log.Printf("Error during server shutdown: %v", err)
		}

		log.Println("Closing database connections...")
		if err := s.config.Close(shutdownCtx); err != nil {
			log.Printf("Error closing database connections: %v", err)
		}

		os.Exit(0)
	}()

	// Start the server
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("could not start server: %v", err)
	}

	return nil
}

// Stop gracefully shuts down the server
func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
