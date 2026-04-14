# Composable Enterprises:
## Frameworks for Scalable Development from Startup Speed to Enterprise Stability

![QCommerce Architecture](assets/MTP2-img-1.png)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Abstract

Composable enterprises represent a modern architectural approach that enables organizations to achieve rapid innovation while maintaining enterprise-grade stability. This report explores the principles, frameworks, and technologies that enable composable architectures, focusing on modularity, interoperability, and scalability. It examines how startups leverage composable systems for speed and flexibility, while large enterprises adopt them to modernize legacy systems and ensure resilience. Key architectural patterns, governance models, and implementation challenges are discussed, along with real-world use cases across industries. The study concludes that composable enterprises provide a sustainable path for organizations to adapt to dynamic market conditions while balancing agility and operational robustness.

QCommerce is an example to represent this model.

## 🏗️ Architecture Overview

This project implements a **composable architecture** with:

- **Micro-frontend orchestration** using Single-SPA
- **Independent backend services** (Go & Python)
- **Modular frontend applications** with shared routing
- **PostgreSQL database** with connection pooling
- **RESTful APIs** with comprehensive error handling
- **CORS-enabled** cross-origin communication

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    QCommerce Platform                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Customer FE     │  │ Store FE        │  │ Admin FE    │ │
│  │ (React + SPA)   │  │ (React + SPA)   │  │ (Planned)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                           │                        │        │
├───────────────────────────┼────────────────────────┼────────┤
│  ┌─────────────────┐     │  ┌─────────────────┐     │        │
│  │ Customer BE     │◄────┘  │ Store BE        │◄────┘        │
│  │ (Go + Gorilla)  │        │ (Python + Fast) │              │
│  └─────────────────┘        └─────────────────┘              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ PostgreSQL Database                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
MTP-2/
├── customer_website_be/          # Go backend for customer operations
│   ├── app/                      # Business logic layers
│   │   ├── customer/            # Customer management
│   │   ├── order/               # Order processing
│   │   └── product/             # Product catalog
│   ├── config/                  # Configuration management
│   ├── domain/                  # Domain models
│   ├── server/                  # HTTP handlers & routing
│   ├── helper/                  # Utility functions
│   ├── main.go                  # Application entry point
│   ├── go.mod                   # Go dependencies
│   └── env.example              # Environment variables template
├── customer_website_fe/          # React micro-frontend for customers
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── config/              # API configuration
│   │   └── services/            # API service layer
│   ├── package.json
│   └── webpack.config.js
├── store_website_be/             # Python FastAPI backend for stores
│   ├── models/                  # Pydantic models
│   ├── routers/                 # API route handlers
│   ├── services/                # Business logic & DB layer
│   ├── Exceptions/              # Custom exception handlers
│   ├── main.py                  # FastAPI application
│   └── requirements.txt         # Python dependencies
├── store_website_fe/             # React micro-frontend for store management
│   ├── src/
│   │   ├── components/          # Store-specific components
│   │   ├── pages/               # Store management pages
│   │   ├── config/              # API configuration
│   │   └── services/            # API services
│   ├── package.json
│   └── webpack.config.js
├── qcommerce_website/            # Main portal & micro-frontend orchestrator
│   ├── src/
│   │   ├── index.ejs            # Main HTML template
│   │   ├── index.js             # Single-SPA configuration
│   │   └── root.component.js    # Root component
│   ├── package.json
│   └── webpack.config.js
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- **Go 1.25.3+** for customer backend
- **Python 3.8+** for store backend
- **Node.js 16+** for all frontend applications
- **PostgreSQL 12+** database
- **npm** or **yarn** package manager

### 1. Database Setup

```bash
# Create PostgreSQL databases
createdb qcommerce
createdb store_db  # If using separate DB for store backend
```

### 2. Backend Services

#### Customer Backend (Go)
```bash
cd customer_website_be
cp env.example .env
# Edit .env with your database credentials
go mod tidy
go run main.go
```
**Server:** http://localhost:8002

#### Store Backend (Python)
```bash
cd store_website_be
pip install -r requirements.txt
# Set environment variables or create .env
uvicorn main:app --reload
```
**Server:** http://localhost:8000

### 3. Frontend Applications

#### Main Portal
```bash
cd qcommerce_website
npm install
npm start
```
**Portal:** http://localhost:9000

#### Customer Frontend
```bash
cd customer_website_fe
npm install
npm start
```
**Customer App:** http://localhost:8080

#### Store Frontend
```bash
cd store_website_fe
npm install
npm start
```
**Store App:** http://localhost:8081

## 🔧 Configuration

### Environment Variables

#### Customer Backend (.env)
```env
ENV=development
SERVER_HOST=localhost
SERVER_PORT=8002
SERVER_READ_TIMEOUT=15s
SERVER_WRITE_TIMEOUT=15s
DATABASE_URL=postgres://user:pass@localhost:5432/qcommerce?sslmode=disable
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=5
DB_CONN_MAX_LIFETIME=5m
DB_CONN_MAX_IDLE_TIME=10m
```

#### Store Backend (Environment Variables)
```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/store_db"
export CORS_ORIGIN="http://localhost:8081,http://localhost:9000"
```

## 📡 API Documentation

### Customer Backend APIs

#### Health Check
```http
GET /api/health
```

#### Products
```http
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

#### Customers
```http
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

#### Orders
```http
GET    /api/orders
GET    /api/orders/{id}
POST   /api/orders
PUT    /api/orders/{id}
DELETE /api/orders/{id}
```

### Store Backend APIs

#### Health Check
```http
GET /ping
```

#### Store Users
```http
GET    /stores/users
POST   /stores/users
GET    /stores/users/{id}
PUT    /stores/users/{id}
DELETE /stores/users/{id}
```

#### Products
```http
GET    /stores/products
POST   /stores/products
GET    /stores/products/{id}
PUT    /stores/products/{id}
DELETE /stores/products/{id}
```

## 🛠️ Technology Stack

### Backend Services

| Service | Technology | Framework | Database |
|---------|------------|-----------|----------|
| Customer BE | Go 1.25.3 | Gorilla Mux | PostgreSQL |
| Store BE | Python 3.8+ | FastAPI | PostgreSQL |

### Frontend Applications

| Component | Technology | Framework | Build Tool |
|-----------|------------|-----------|------------|
| Main Portal | JavaScript | Single-SPA | Webpack |
| Customer FE | React 18.2.0 | Single-SPA React | Webpack |
| Store FE | React 18.2.0 | Single-SPA React | Webpack |

### Key Dependencies

#### Go Backend
- `gorilla/mux` - HTTP router and URL matcher
- `jackc/pgx/v5` - PostgreSQL driver
- `joho/godotenv` - Environment variable loading
- `caarlos0/env/v11` - Environment configuration

#### Python Backend
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `psycopg2` - PostgreSQL adapter
- `pydantic` - Data validation
- `python-decouple` - Environment variable management

#### Frontend
- `react` & `react-dom` - UI library
- `react-router-dom` - Client-side routing
- `single-spa` & `single-spa-react` - Micro-frontend framework
- `webpack` - Module bundler

## 🏛️ Architecture Principles

### Composable Design

1. **Modularity**: Each service/component can be developed, deployed, and scaled independently
2. **Interoperability**: Standardized APIs and data formats enable seamless integration
3. **Scalability**: Horizontal scaling of individual components without affecting others
4. **Maintainability**: Clear separation of concerns and single responsibility principle

### Micro-frontend Benefits

- **Independent Deployment**: Deploy frontend modules without affecting others
- **Technology Diversity**: Use different frameworks/libraries per module
- **Team Autonomy**: Teams can work on different modules simultaneously
- **Performance**: Load only required modules for specific user roles

### Backend Microservices

- **Domain-Driven Design**: Clear bounded contexts for customer and store operations
- **API Gateway Pattern**: Centralized request routing and cross-cutting concerns
- **Database per Service**: Isolated data management with proper transactions
- **Event-Driven Communication**: Asynchronous processing for order fulfillment

## 🔒 Security Features

- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Comprehensive request validation using Pydantic/Go structs
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Environment Isolation**: Separate configurations for development/production

## 📊 Data Models

### Core Entities

#### Customer
```go
type Customer struct {
    ID        string
    FirstName string
    LastName  string
    Email     string
    Phone     string
    Addresses map[string]any
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

#### Product
```go
type Product struct {
    ID          string
    Name        string
    Description string
    Price       float64
    Quantity    int
    StoreID     string
    Attributes  []ProductAttribute
    Images      []ProductImage
    Status      bool
}
```

#### Order
```go
type Order struct {
    OrderID     string
    CustomerID  string
    TotalAmount float64
    Items       []OrderItem
    Status      int
    CreatedAt   time.Time
}
```

## 🚀 Deployment

### Development
```bash
# Start all services with hot reload
# Backend services with respective run commands
# Frontend applications with npm start
```

### Production
```bash
# Build frontend applications
cd customer_website_fe && npm run build
cd store_website_fe && npm run build
cd qcommerce_website && npm run build

# Build Go binary
cd customer_website_be && go build -o bin/customer-be main.go

# Deploy Python with uvicorn/gunicorn
cd store_website_be && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Built as part of IIT Jodhpur Major Technical Project (MTP-2)
- Demonstrates composable enterprise architecture principles
- Implements modern web development practices with microservices and micro-frontends

---

**Composable Enterprises: Frameworks for Scalable Development from Startup Speed to Enterprise Stability**

This implementation showcases how composable architectures enable organizations to achieve rapid innovation while maintaining enterprise-grade stability. The modular design allows for independent development, deployment, and scaling of components, demonstrating the practical application of composable enterprise principles in a real-world e-commerce platform.