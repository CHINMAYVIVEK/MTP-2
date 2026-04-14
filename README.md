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

- **Docker & Docker Compose** for containerized deployment
- **Go 1.25.3+** for customer backend development
- **Python 3.8+** for store backend development
- **Node.js 16+** for frontend development
- **PostgreSQL 12+** database (handled by Docker)

### Docker Deployment (Recommended)

```bash
# Clone and navigate to project
cd MTP-2

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Access Points:**
- **Main Portal**: http://localhost:8505
- **Customer Frontend**: http://localhost:8503
- **Store Frontend**: http://localhost:8504
- **Customer Backend API**: http://localhost:8501
- **Store Backend API**: http://localhost:8502

### Manual Development Setup

#### 1. Database Setup
```bash
# PostgreSQL connection (handled automatically in Docker)
# DATABASE_URL=postgresql://neondb_owner:npg_xxx@ep-plain-hill-xxx.aws.neon.tech/neondb?sslmode=require
```

#### 2. Backend Services

**Customer Backend (Go)**
```bash
cd customer_website_be
cp env.example .env
# Configure .env with database URL and ports
go mod tidy
go run main.go
```
**API:** http://localhost:8501

**Store Backend (Python)**
```bash
cd store_website_be
pip install -r requirements.txt
# Set DATABASE_URL environment variable
uvicorn main:app --reload --port 8502
```
**API:** http://localhost:8502

#### 3. Frontend Applications

**Main Portal (Single-SPA Orchestrator)**
```bash
cd qcommerce_website
npm install
npm start
```
**Portal:** http://localhost:8505

**Customer Frontend**
```bash
cd customer_website_fe
npm install
npm start
```
**App:** http://localhost:8503

**Store Frontend**
```bash
cd store_website_fe
npm install
npm start
```
**App:** http://localhost:8504

## 🔧 Configuration

### Environment Variables

#### Docker Environment (Recommended)
All services are pre-configured in `docker-compose.yml` with:
- **Database**: Neon PostgreSQL cloud instance
- **Ports**: 8501-8505 for all services
- **CORS**: Configured for cross-service communication
- **Networking**: Container-to-container communication

#### Customer Backend (.env)
```env
ENV=development
SERVER_HOST=0.0.0.0
SERVER_PORT=8501
SERVER_READ_TIMEOUT=15s
SERVER_WRITE_TIMEOUT=15s
SERVER_IDLE_TIMEOUT=120s
DATABASE_URL=postgresql://user:pass@host:5432/db_name?sslmode=require
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=5
DB_CONN_MAX_LIFETIME=5m
DB_CONN_MAX_IDLE_TIME=10m
CORS_ORIGIN=http://customer-frontend:8503,http://store-frontend:8504,http://qcommerce-website:8505
CUSTOMER_FE_PORT=8503
STORE_FE_PORT=8504
QCOMMERCE_PORT=8505
REACT_APP_API_URL=http://customer-backend:8501/api
REACT_APP_STORE_API_URL=http://store-backend:8502
```

#### Store Backend (Environment Variables)
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db_name?sslmode=require"
CORS_ORIGIN="http://customer-frontend:8503,http://store-frontend:8504,http://qcommerce-website:8505"
SERVER_HOST=0.0.0.0
SERVER_PORT=8502
CUSTOMER_FE_PORT=8503
STORE_FE_PORT=8504
QCOMMERCE_PORT=8505
```

## 📡 API Documentation

### Customer Backend APIs (http://localhost:8501/api)

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

### Store Backend APIs (http://localhost:8502)

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
GET    /stores/users/login
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

### Docker Compose (Recommended)

```bash
# Development with hot reload
docker compose up

# Production deployment
docker compose up -d

# View service logs
docker compose logs [service-name]

# Stop all services
docker compose down

# Rebuild after code changes
docker compose up --build

# Scale specific services
docker compose up -d --scale customer-backend=3
```

### Manual Development

#### Backend Services
```bash
# Customer Backend (Go)
cd customer_website_be
go build -o bin/customer-be main.go
./bin/customer-be

# Store Backend (Python)
cd store_website_be
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8502
```

#### Frontend Applications
```bash
# Build all frontend applications
cd customer_website_fe && npm run build
cd store_website_fe && npm run build
cd qcommerce_website && npm run build

# Serve built applications with nginx/apache
```

### Production Considerations

- **Database**: Uses Neon PostgreSQL for cloud-hosted database
- **Load Balancing**: Implement reverse proxy (nginx) for production
- **SSL/TLS**: Configure HTTPS certificates
- **Monitoring**: Add logging and monitoring solutions
- **Security**: Implement proper authentication and authorization
- **Scaling**: Use Docker Swarm or Kubernetes for horizontal scaling

## 🐳 Docker Services

| Service | Port | Technology | Description |
|---------|------|------------|-------------|
| `customer-backend` | 8501 | Go + Gorilla Mux | Customer operations API |
| `store-backend` | 8502 | Python + FastAPI | Store management API |
| `customer-frontend` | 8503 | React + Single-SPA | Customer-facing interface |
| `store-frontend` | 8504 | React + Single-SPA | Store management interface |
| `qcommerce-website` | 8505 | Single-SPA | Main portal orchestrator |

### Service Dependencies
- `customer-backend` depends on `store-backend`
- `qcommerce-website` depends on both frontends
- All services share the same PostgreSQL database instance

### Container Networking
- Services communicate using container names (e.g., `http://customer-backend:8501`)
- CORS configured for cross-service communication
- External access through published ports (8501-8505)

## 🙏 Acknowledgments

- Built as part of IIT Jodhpur Major Technical Project (MTP-2)
- Demonstrates composable enterprise architecture principles
- Implements modern web development practices with microservices and micro-frontends

---

**Composable Enterprises: Frameworks for Scalable Development from Startup Speed to Enterprise Stability**

This implementation showcases how composable architectures enable organizations to achieve rapid innovation while maintaining enterprise-grade stability. The modular design allows for independent development, deployment, and scaling of components, demonstrating the practical application of composable enterprise principles in a real-world e-commerce platform.