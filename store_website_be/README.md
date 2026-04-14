# Store Website Backend

Backend API for the **QCommerce store website**. Built in **Python** with **FastAPI**.
Provides endpoints for **Store Users**, **Products**, and **Store Management**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Environment Variables](#environment-variables)
4. [Setup & Running](#setup--running)
5. [API Reference](#api-reference)

---

## Project Overview

* Modular backend architecture (`models`, `routers`, `services`, `exceptions`)
* RESTful API endpoints for **store users**, **products**, and **store operations**
* PostgreSQL database integration with connection pooling
* Configurable environment via environment variables

---

## Directory Structure

```
.
├── models/                  # Pydantic models for API requests/responses
├── routers/                 # API route handlers
├── services/                # Business logic & database operations
├── exceptions/              # Custom exception handlers
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
└── README.md
```

---

## Environment Variables

Set the following environment variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:5432/qcommerce?sslmode=disable

# CORS Configuration
CORS_ORIGIN=http://localhost:8503,http://localhost:8504,http://localhost:8505
```

---

## Setup & Running

```bash
cd store_website_be

# Install dependencies
pip install -r requirements.txt

# Run server in development
uvicorn main:app --reload --host 0.0.0.0 --port 8502

# OR run with Docker
docker compose up store-backend
```

Server URL: `http://localhost:8502`

---

## API Reference

### Health Check

| Method | Path      | Request Body | Response                                      |
| ------ | --------- | ------------ | --------------------------------------------- |
| GET    | `/ping`   | None         | `{"message": "Success"}`                      |

### Store Users

#### Register Store User

| Method | Path          | Request Body                                                                 | Response                                                                 |
| ------ | ------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| POST   | `/stores/users` | `{"firstName": "string", "lastName": "string", "storeName": "string", "email": "string", "password": "string", "phone": "string", "img_url": "string", "addresses": []}` | `{"id": "uuid", "message": "Store user added successfully"}` |

#### Login Store User

| Method | Path                    | Query Params          | Request Body | Response                                                                 |
| ------ | ----------------------- | --------------------- | ------------ | ------------------------------------------------------------------------ |
| GET    | `/stores/users/login`   | `email`, `password`   | None         | Store user object with authentication details                           |

#### Update Store User

| Method | Path                      | Request Body                                                                 | Response                                                                 |
| ------ | ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| PUT    | `/stores/users/{user_id}` | `{"firstName": "string", "lastName": "string", "storeName": "string", "email": "string", "phone": "string", "img_url": "string", "addresses": []}` | `{"id": "uuid", "message": "Store user updated successfully"}` |

#### Get Store User

| Method | Path                        | Request Body | Response                                                                 |
| ------ | --------------------------- | ------------ | ------------------------------------------------------------------------ |
| GET    | `/stores/users/{user_id}`   | None         | Store user object                                                       |

### Products

#### Get Products

| Method | Path                | Query Params    | Request Body | Response                                      |
| ------ | ------------------- | --------------- | ------------ | --------------------------------------------- |
| GET    | `/stores/products`  | `store_id`      | None         | Array of product objects                      |

#### Create Product

| Method | Path                | Request Body                                                                 | Response                                                                 |
| ------ | ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| POST   | `/stores/products`  | `{"name": "string", "description": "string", "price": float, "quantity": int, "storeUserId": "uuid", "attributes": [], "images": []}` | `{"id": "uuid", "message": "Product created successfully"}` |

#### Get Product

| Method | Path                          | Request Body | Response                                      |
| ------ | ----------------------------- | ------------ | --------------------------------------------- |
| GET    | `/stores/products/{product_id}` | None         | Product object                                |

#### Update Product

| Method | Path                            | Request Body                                                                 | Response                                                                 |
| ------ | ------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| PUT    | `/stores/products/{product_id}` | `{"name": "string", "description": "string", "price": float, "quantity": int, "attributes": [], "images": []}` | `{"id": "uuid", "message": "Product updated successfully"}` |

#### Delete Product

| Method | Path                            | Request Body | Response                                                                 |
| ------ | ------------------------------- | ------------ | ------------------------------------------------------------------------ |
| DELETE | `/stores/products/{product_id}` | None         | `{"id": "uuid", "message": "Product deleted successfully"}` |

---
