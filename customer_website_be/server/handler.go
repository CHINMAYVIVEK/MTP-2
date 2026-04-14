package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"qcommerce_backend/app/customer"
	"qcommerce_backend/app/order"
	"qcommerce_backend/app/product"
	"qcommerce_backend/domain"

	"github.com/gorilla/mux"
)

// ============================================================================
// Health Handler
// ============================================================================

// handleHealthCheck verifies that the server is running.
func (s *Server) handleHealthCheck(w http.ResponseWriter, _ *http.Request) {
	RespondJSON(w, http.StatusOK, "success", "Server is healthy", map[string]string{"status": "healthy"})
}

// ============================================================================
// Product Handlers
// ============================================================================

// handleListProducts returns a handler that lists products (with pagination + optional store filter)
func (s *Server) handleListProducts(productService *product.ProductService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		storeUserID := r.URL.Query().Get("store_user_id")
		limitParam := r.URL.Query().Get("limit")
		offsetParam := r.URL.Query().Get("offset")
		pageParam := r.URL.Query().Get("page")

		limit := 10
		offset := 0

		if v, err := strconv.Atoi(limitParam); err == nil && v > 0 {
			limit = v
		}
		if v, err := strconv.Atoi(offsetParam); err == nil && v >= 0 {
			offset = v
		} else if v, err := strconv.Atoi(pageParam); err == nil && v > 0 {
			offset = (v - 1) * limit
		}

		var (
			products []domain.Product
			err      error
		)

		if storeUserID != "" {
			products, err = productService.GetProductsByStoreUser(r.Context(), storeUserID, limit, offset)
		} else {
			products, err = productService.ListProductsPage(r.Context(), limit, offset)
		}

		if err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to retrieve products: %v", err), nil)
			return
		}

		if products == nil {
			products = []domain.Product{}
		}
		RespondJSON(w, http.StatusOK, "success", "Products retrieved successfully", products)
	}
}

// handleGetProductByID returns a handler to retrieve product details by ID
func (s *Server) handleGetProductByID(productService *product.ProductService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		if id == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "Product ID is required", nil)
			return
		}

		product, err := productService.GetProductByID(r.Context(), id)
		if err != nil {
			RespondJSON(w, http.StatusNotFound, "error", fmt.Sprintf("Product not found: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Product retrieved successfully", product)
	}
}

// ============================================================================
// Order Handlers
// ============================================================================

// handlePlaceOrder creates a new order
func (s *Server) handlePlaceOrder(orderService *order.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var o domain.Order
		if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
			RespondJSON(w, http.StatusBadRequest, "error", "Invalid JSON body", nil)
			return
		}

		if o.CustomerID == "" || len(o.Items) == 0 {
			RespondJSON(w, http.StatusBadRequest, "error", "Order must include customer_id and items", nil)
			return
		}

		created, err := orderService.CreateOrder(r.Context(), &o)
		if err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to create order: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusCreated, "success", "Order placed successfully", created)
	}
}

// handleGetOrderByID retrieves a single order by ID
func (s *Server) handleGetOrderByID(orderService *order.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderID := mux.Vars(r)["order_id"]
		if orderID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "order_id is required", nil)
			return
		}

		o, err := orderService.GetOrderByID(r.Context(), orderID)
		if err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to get order: %v", err), nil)
			return
		}
		if o == nil {
			RespondJSON(w, http.StatusNotFound, "error", "Order not found", nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Order retrieved successfully", o)
	}
}

// handleGetOrdersByUser retrieves all orders for a user
func (s *Server) handleGetOrdersByUser(orderService *order.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := mux.Vars(r)["user_id"]
		if userID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "user_id is required", nil)
			return
		}

		status := r.URL.Query().Get("status")

		orders, err := orderService.GetOrdersByUser(r.Context(), userID, status)
		if err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to get user orders: %v", err), nil)
			return
		}

		if orders == nil {
			orders = []domain.Order{}
		}

		RespondJSON(w, http.StatusOK, "success", "Orders retrieved successfully", orders)
	}
}

// handleUpdateOrderStatus updates an order’s status
func (s *Server) handleUpdateOrderStatus(orderService *order.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderID := mux.Vars(r)["order_id"]
		if orderID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "order_id is required", nil)
			return
		}

		var body struct {
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Status == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "Valid status is required", nil)
			return
		}

		updated, err := orderService.UpdateOrderStatus(r.Context(), orderID, body.Status)
		if err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to update order status: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Order status updated successfully", updated)
	}
}

// handleCancelOrder cancels an existing order
func (s *Server) handleCancelOrder(orderService *order.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderID := mux.Vars(r)["order_id"]
		if orderID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "order_id is required", nil)
			return
		}

		if err := orderService.CancelOrder(r.Context(), orderID); err != nil {
			RespondJSON(w, http.StatusInternalServerError, "error", fmt.Sprintf("Failed to cancel order: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Order canceled successfully", nil)
	}
}

// ============================================================================
// Customer Handlers
// ============================================================================

// handleRegister creates a new customer account
func (s *Server) handleRegister(customerService *customer.CustomerService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			FirstName string         `json:"first_name"`
			LastName  string         `json:"last_name"`
			Email     string         `json:"email"`
			Phone     string         `json:"phone"`
			AvatarURL *string        `json:"avatar_url,omitempty"`
			Addresses map[string]any `json:"addresses,omitempty"`
			Password  string         `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			RespondJSON(w, http.StatusBadRequest, "error", "Invalid JSON body", nil)
			return
		}

		if body.Email == "" || body.Password == "" || body.FirstName == "" || body.LastName == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "email, password, first_name, and last_name are required", nil)
			return
		}

		c := &domain.Customer{
			FirstName: body.FirstName,
			LastName:  body.LastName,
			Email:     body.Email,
			Phone:     body.Phone,
			AvatarURL: body.AvatarURL,
			Addresses: body.Addresses,
		}

		registered, err := customerService.Register(r.Context(), c, body.Password)
		if err != nil {
			statusCode := http.StatusInternalServerError
			if err.Error() == fmt.Sprintf("customer with email %s already exists", body.Email) {
				statusCode = http.StatusConflict
			}
			RespondJSON(w, statusCode, "error", fmt.Sprintf("Failed to register: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusCreated, "success", "Customer registered successfully", registered)
	}
}

// handleLogin authenticates a customer
func (s *Server) handleLogin(customerService *customer.CustomerService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			RespondJSON(w, http.StatusBadRequest, "error", "Invalid JSON body", nil)
			return
		}

		if body.Email == "" || body.Password == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "email and password are required", nil)
			return
		}

		customer, err := customerService.Login(r.Context(), body.Email, body.Password)
		if err != nil {
			statusCode := http.StatusUnauthorized
			if err.Error() != "invalid email or password" {
				statusCode = http.StatusInternalServerError
			}
			RespondJSON(w, statusCode, "error", fmt.Sprintf("Login failed: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Login successful", customer)
	}
}

// handleUpdateCustomer updates customer information (partial update - only updates sent fields)
func (s *Server) handleUpdateCustomer(customerService *customer.CustomerService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			ID        string         `json:"id"`
			FirstName *string        `json:"first_name,omitempty"`
			LastName  *string        `json:"last_name,omitempty"`
			Phone     *string        `json:"phone,omitempty"`
			AvatarURL *string        `json:"avatar_url,omitempty"`
			Addresses map[string]any `json:"addresses,omitempty"`
		}

		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			RespondJSON(w, http.StatusBadRequest, "error", "Invalid JSON body", nil)
			return
		}

		if body.ID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "customer ID is required", nil)
			return
		}

		// Create update struct with only provided fields
		update := &domain.Customer{
			ID: body.ID,
		}
		if body.FirstName != nil {
			update.FirstName = *body.FirstName
		}
		if body.LastName != nil {
			update.LastName = *body.LastName
		}
		if body.Phone != nil {
			update.Phone = *body.Phone
		}
		if body.AvatarURL != nil {
			update.AvatarURL = body.AvatarURL
		}
		if body.Addresses != nil {
			update.Addresses = body.Addresses
		}

		updated, err := customerService.UpdateCustomer(r.Context(), update)
		if err != nil {
			statusCode := http.StatusInternalServerError
			if err.Error() == "customer not found" {
				statusCode = http.StatusNotFound
			}
			RespondJSON(w, statusCode, "error", fmt.Sprintf("Failed to update customer: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Customer updated successfully", updated)
	}
}

// handleGetProfile retrieves a customer's profile
func (s *Server) handleGetProfile(customerService *customer.CustomerService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		customerID := mux.Vars(r)["id"]
		if customerID == "" {
			RespondJSON(w, http.StatusBadRequest, "error", "customer ID is required", nil)
			return
		}

		customer, err := customerService.GetProfile(r.Context(), customerID)
		if err != nil {
			statusCode := http.StatusInternalServerError
			if err.Error() == "customer not found" {
				statusCode = http.StatusNotFound
			}
			RespondJSON(w, statusCode, "error", fmt.Sprintf("Failed to get profile: %v", err), nil)
			return
		}

		RespondJSON(w, http.StatusOK, "success", "Profile retrieved successfully", customer)
	}
}
