# Customer Website Frontend

A microfrontend application for customers to browse products, manage orders, and interact with the QCommerce platform.

## Features

### Product Browsing

- **Home Page**: Browse and search through available products
- **Product Details**: View detailed product information, images, and specifications
- **Product Categories**: Filter products by categories and attributes

### User Authentication

- **Login**: Customer authentication with email/password
- **Registration**: New customer account creation with validation
- **Profile Management**: View and update customer profile information

### Order Management

- **Place Orders**: Add products to cart and complete purchases
- **Order History**: View past orders and order status
- **Order Tracking**: Track order fulfillment and delivery

### Shopping Cart

- **Add to Cart**: Add/remove products from shopping cart
- **Cart Management**: Update quantities and review cart contents
- **Checkout Process**: Complete purchase with shipping and payment information

## Installation

```bash
cd customer_website_fe
npm install
```

## Running the Application

```bash
# Development mode
npm start

# Production build
npm run build
```

The application will be available at `http://localhost:8503`

## Technology Stack

- **React 18** - UI library
- **React Router DOM 7** - Client-side routing
- **Single-SPA React** - Microfrontend framework
- **Webpack 5** - Module bundling
- **Babel** - JavaScript transpilation

## Project Structure

```
customer_website_fe/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   └── ProductCard.jsx     # Product display component
│   ├── pages/
│   │   ├── HomePage.jsx        # Product listing
│   │   └── ProductPage.jsx     # Individual product view
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── services/               # API service functions
│   ├── index.js                # Single-SPA entry point
│   ├── root.component.js       # Root React component
│   └── styles.css              # Global styles
├── package.json
├── webpack.config.js
└── README.md
```

## API Integration

The frontend communicates with the Customer Backend API:

- **Base URL**: `http://localhost:8501/api` (development) / `http://customer-backend:8501/api` (Docker)
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Comprehensive error handling for network and API errors

## Environment Variables

```bash
REACT_APP_API_URL=http://localhost:8501/api  # Development
# REACT_APP_API_URL=http://customer-backend:8501/api  # Docker
```

## Development

### Available Scripts

- `npm start` - Start development server on port 8503
- `npm run build` - Create production build
- `npm test` - Run tests (if implemented)

### Code Style

- Uses ESLint for code linting
- Follows React best practices
- Implements proper error boundaries
- Uses modern JavaScript features (ES6+)

## Deployment

The application is containerized and can be deployed using Docker:

```bash
docker compose up customer-frontend
```

The container serves the built application on port 8503.
