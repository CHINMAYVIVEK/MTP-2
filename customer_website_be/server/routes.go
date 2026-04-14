package server

import (
	"net/http"
	"qcommerce_backend/app/customer"
	"qcommerce_backend/app/order"
	"qcommerce_backend/app/product"

	"github.com/gorilla/mux"
)

// SetupRoutes initializes all API routes and injects dependencies once per startup.
func (s *Server) SetupRoutes() {
	router := mux.NewRouter()

	// -------------------------------------------------------------------------
	// Initialize services (single instantiation for better performance)
	// -------------------------------------------------------------------------
	customerService := customer.NewService(s.db)
	productService := product.NewService(s.db)
	orderService := order.NewService(s.db)

	// -------------------------------------------------------------------------
	// Health Check
	// -------------------------------------------------------------------------
	// GET /api/health
	router.HandleFunc("/api/health", s.handleHealthCheck).Methods("GET")
	// No body required. Returns server status.

	// -------------------------------------------------------------------------
	// Customer Routes
	// -------------------------------------------------------------------------
	// POST /api/customers/register
	// Body JSON:
	// {
	//   "first_name": "string",
	//   "last_name": "string",
	//   "email": "string",
	//   "phone": "string",
	//   "password": "string",
	//   "avatar_url": "string (optional)",
	//   "addresses": {} (optional)
	// }
	router.HandleFunc("/api/customers/register", s.handleRegister(customerService)).Methods("POST")

	// POST /api/customers/login
	// Body JSON:
	// {
	//   "email": "string",
	//   "password": "string"
	// }
	router.HandleFunc("/api/customers/login", s.handleLogin(customerService)).Methods("POST")

	// PUT /api/customers/update
	// Body JSON:
	// {
	//   "id": "string",
	//   "first_name": "string",
	//   "last_name": "string",
	//   "phone": "string",
	//   "avatar_url": "string (optional)",
	//   "addresses": {} (optional)
	// }
	router.HandleFunc("/api/customers/update", s.handleUpdateCustomer(customerService)).Methods("PUT")

	// GET /api/customers/{id}
	// Path parameter:
	// - id: customer ID
	router.HandleFunc("/api/customers/{id}", s.handleGetProfile(customerService)).Methods("GET")

	// -------------------------------------------------------------------------
	// Product Routes
	// -------------------------------------------------------------------------
	// GET /api/products?store_user_id={storeUserID}&limit={limit}&offset={offset}&page={page}
	// Optional query parameters:
	// - store_user_id: filter by store
	// - limit: number of products per page
	// - offset/page: pagination
	router.HandleFunc("/api/products", s.handleListProducts(productService)).Methods("GET")

	// GET /api/products/{id}
	// Path parameter:
	// - id: product ID
	router.HandleFunc("/api/products/{id}", s.handleGetProductByID(productService)).Methods("GET")

	// -------------------------------------------------------------------------
	// Order Routes
	// -------------------------------------------------------------------------
	// POST /api/orders
	// Body JSON:
	// {
	//   "customer_id": "string",
	//   "items": [
	//     {"product_id": "string", "quantity": 1}
	//   ]
	// }
	router.HandleFunc("/api/orders", s.handlePlaceOrder(orderService)).Methods("POST")

	// GET /api/orders/{order_id}
	// Path parameter:
	// - order_id: fetch a single order
	router.HandleFunc("/api/orders/{order_id}", s.handleGetOrderByID(orderService)).Methods("GET")

	// GET /api/orders/user/{user_id}?status={status}
	// Path parameter:
	// - user_id: fetch orders for this user
	// Optional query parameter:
	// - status: filter orders by status (pending, shipped, etc.)
	router.HandleFunc("/api/orders/user/{user_id}", s.handleGetOrdersByUser(orderService)).Methods("GET")

	// PUT /api/orders/{order_id}/status
	// Path parameter:
	// - order_id: order to update
	// Body JSON:
	// {
	//   "status": "shipped"
	// }
	router.HandleFunc("/api/orders/{order_id}/status", s.handleUpdateOrderStatus(orderService)).Methods("PUT")

	// DELETE /api/orders/{order_id}
	// Path parameter:
	// - order_id: cancel the order
	router.HandleFunc("/api/orders/{order_id}", s.handleCancelOrder(orderService)).Methods("DELETE")

	// -------------------------------------------------------------------------
	// CORS Middleware - Allow all origins
	// -------------------------------------------------------------------------
	corsHandler := corsMiddleware(router)

	// -------------------------------------------------------------------------
	// Mount router with CORS
	// -------------------------------------------------------------------------
	s.mux.Handle("/", corsHandler)
}

// corsMiddleware adds CORS headers to allow all origins
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers - allow all origins
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "3600")

		// Handle preflight OPTIONS requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Continue with the next handler
		next.ServeHTTP(w, r)
	})
}
