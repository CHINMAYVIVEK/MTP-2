# Customer Website Backend

Backend API for the **QCommerce customer website**. Built in **Go** with **Gorilla Mux**.
Provides endpoints for **Products**, **Customer**, and **Orders**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Environment Variables](#environment-variables)
4. [Setup & Running](#setup--running)
5. [API Reference](#api-reference)
   
---

## Project Overview

* Modular backend architecture (`app`, `domain`, `server`, `config`)
* RESTful API endpoints for **products**, **customers**, and **orders**
* PostgreSQL database integration with connection pooling
* Configurable environment via `.env`

---

## Directory Structure

```
.
├── app        # Business logic (customer, order, product)
├── config     # Server and DB configuration
├── domain     # Entities/models
├── helper     # Utility functions
├── server     # Handlers and router
├── tmp        # Temporary logs/build files
├── main.go
├── go.mod
└── README.md
```

---

## Environment Variables

Create a `.env` file from `env.example`:

```env
ENV=development

SERVER_HOST=localhost
SERVER_PORT=8501
SERVER_READ_TIMEOUT=15s
SERVER_WRITE_TIMEOUT=15s

DATABASE_URL=postgres://postgres:your_password_here@localhost:5432/qcommerce?sslmode=disable
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=5
DB_CONN_MAX_LIFETIME=5m
DB_CONN_MAX_IDLE_TIME=10m
```

---

## Setup & Running

```bash
cd customer_website_be

# Install dependencies
go mod tidy

# Run server in development
go run main.go

# OR build production binary
go build -o customer_website_be main.go
./customer_website_be
```

Server URL: `http://localhost:8501`

---

## API Reference

To make it **easy to scan**, each endpoint is displayed in a **table format** with **Method**, **Path**, **Request Body**, and **Example Response**.

---

### Health Check

| Method | Path          | Request Body | Response                                                                                       |
| ------ | ------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| GET    | `/api/health` | None         | `json { "status": "success", "message": "Server is healthy", "data": {"status": "healthy"} } ` |

---

### Products

#### List Products

| Method | Path            | Query Params                               | Request Body | Response                                                                             |
| ------ | --------------- | ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------ |
| GET    | `/api/products` | `store_user_id`, `limit`, `offset`, `page` | None         | `json [ { "id": "123", "name": "Product Name", "price": 10.5, "stock": 20 }, ... ] ` |

#### Get Product by ID

| Method | Path                 | Request Body | Response                                                                    |
| ------ | -------------------- | ------------ | --------------------------------------------------------------------------- |
| GET    | `/api/products/{id}` | None         | `json { "id": "123", "name": "Product Name", "price": 10.5, "stock": 20 } ` |

---

### Customer

#### Register Customer

| Method | Path                    | Request Body                                                                                                 | Response                                                                                                                                    |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/customers/register` | `json { "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "1234567890", "password": "securepass", "avatar_url": "https://...", "addresses": {} } ` | `json { "id": "c123", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "1234567890", "created_at": "2024-01-01T00:00:00Z" } ` |

#### Login Customer

| Method | Path              | Request Body                                           | Response                                                                                                                                    |
| ------ | ----------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/customers/login` | `json { "email": "john@example.com", "password": "securepass" } ` | `json { "id": "c123", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "1234567890", "created_at": "2024-01-01T00:00:00Z" } ` |

#### Update Customer

| Method | Path                | Request Body                                                                                    | Response                                                                                                                                    |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| PUT    | `/api/customers/update` | `json { "id": "c123", "first_name": "Jane", "last_name": "Doe", "phone": "9876543210", "avatar_url": "https://...", "addresses": {} } ` | `json { "id": "c123", "first_name": "Jane", "last_name": "Doe", "email": "john@example.com", "phone": "9876543210", "updated_at": "2024-01-02T00:00:00Z" } ` |

#### Get Customer Profile

| Method | Path              | Request Body | Response                                                                                                                                    |
| ------ | ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/customers/{id}` | None         | `json { "id": "c123", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "1234567890", "avatar_url": "https://...", "addresses": {}, "created_at": "2024-01-01T00:00:00Z" } ` |

---

### Orders

#### Place Order

| Method | Path          | Request Body                                                                          | Response                                                                                                |
| ------ | ------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| POST   | `/api/orders` | `json { "customer_id": "u123", "items": [ {"product_id": "p123", "quantity": 1} ] } ` | `json { "order_id": "o123", "status": "pending", "items": [ {"product_id": "p123", "quantity": 1} ] } ` |

#### Get Order by ID

| Method | Path                     | Request Body | Response                                                                                                |
| ------ | ------------------------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| GET    | `/api/orders/{order_id}` | None         | `json { "order_id": "o123", "status": "pending", "items": [ {"product_id": "p123", "quantity": 1} ] } ` |

#### Get Orders by User

| Method | Path                         | Query Params        | Request Body | Response                                                                       |
| ------ | ---------------------------- | ------------------- | ------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/orders/user/{user_id}` | `status` (optional) | None         | `json [ { "order_id": "o123", "status": "pending", "items": [ ... ] }, ... ] ` |

#### Update Order Status

| Method | Path                            | Request Body                    | Response                                            |
| ------ | ------------------------------- | ------------------------------- | --------------------------------------------------- |
| PUT    | `/api/orders/{order_id}/status` | `json { "status": "shipped" } ` | `json { "order_id": "o123", "status": "shipped" } ` |

#### Cancel Order

| Method | Path                     | Request Body | Response                                             |
| ------ | ------------------------ | ------------ | ---------------------------------------------------- |
| DELETE | `/api/orders/{order_id}` | None         | `json { "message": "Order canceled successfully" } ` |

---

