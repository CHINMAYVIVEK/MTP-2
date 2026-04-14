# Store Website Frontend

A microfrontend application for store owners to manage their products, user profiles, and interact with the QCommerce platform.

## Features

### Authentication

- **Login Page**: Connects to `GET /stores/users/login` endpoint for authentication
- **Register Page**: Connects to `POST /stores/users` endpoint to create new users with validation
- **Session Management**: JWT tokens stored in localStorage with automatic logout on expiration

### Product Management

- **Home Page**: Fetches and displays all of a user's products from the `GET /stores/products` API
- **CRUD Operations**:
  - **Create (POST)**: Add new products with detailed form including dynamic attributes and images
  - **Read (GET)**: View product details in a modal interface
  - **Update (PUT/PATCH)**: Edit existing products with intelligent partial updates
  - **Delete (DELETE)**: Remove products with confirmation dialog
- **Product Fields**: name, description, shortDescription, price, discountPrice, currency, quantity, weight, category, attributes (dynamic list), images (dynamic list)

### Profile Management

- **Profile Page**: View and edit the logged-in user's profile
- **Update (PUT)**: Sends only changed fields to the `PUT /stores/users/{id}` endpoint
- **Profile Fields**: firstName, lastName, storeName, email, phone, img_url, password (write-only), addresses (dynamic list with sub-fields)

## Installation

```bash
cd store_website_fe
npm install
```

## Running the Application

```bash
# Development mode
npm start

# Production build
npm run build
```

The application will be available at `http://localhost:8504`

## Technology Stack

- **React 18** - UI library
- **React Router DOM 7** - Client-side routing
- **Single-SPA React** - Microfrontend framework
- **Webpack 5** - Module bundling
- **Babel** - JavaScript transpilation
- **Local Storage** - Session management

## Project Structure

```
store_website_fe/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── ProductCard.jsx     # Product display component
│   │   └── ProductModal.jsx    # Product details modal
│   ├── pages/
│   │   ├── HomePage.jsx        # Product listing and management
│   │   ├── LoginPage.jsx       # User authentication
│   │   ├── ProfilePage.jsx     # User profile management
│   │   └── RegisterPage.jsx    # User registration
│   ├── services/
│   │   ├── loginService.js     # Authentication API calls
│   │   ├── productService.js   # Product CRUD operations
│   │   ├── profileService.js   # Profile management
│   │   └── registerService.js  # User registration
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── index.js                # Single-SPA entry point
│   ├── root.component.js       # Root React component
│   └── styles.css              # Global styles
├── package.json
├── webpack.config.js
└── README.md
```

## API Integration

The frontend communicates with the Store Backend API:

- **Base URL**: `http://localhost:8502/api` (development) / `http://store-backend:8502/api` (Docker)
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Comprehensive error handling for network and API errors
- **Data Validation**: Client-side validation with server-side confirmation

## Environment Variables

```bash
REACT_APP_API_URL=http://localhost:8502/api  # Development
# REACT_APP_API_URL=http://store-backend:8502/api  # Docker
```

## Development

### Available Scripts

- `npm start` - Start development server on port 8504
- `npm run build` - Create production build
- `npm test` - Run tests (if implemented)

### Code Style

- Uses ESLint for code linting
- Follows React best practices
- Implements proper error boundaries
- Uses modern JavaScript features (ES6+)
- Maintains separation of concerns between components, services, and pages

## Deployment

The application is containerized and can be deployed using Docker:

```bash
docker compose up store-frontend
```

The container serves the built application on port 8504.
- React Router DOM 7
- single-spa (Microfrontend)
- Webpack 5
- Local Storage for data persistence
- FastAPI Backend (Handles all data persistence)
- JavaScript (ES6+, async/await, fetch)

## Project Structure
```
store_website_fe/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductModal.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HomePage.jsx
│   │   └── ProfilePage.jsx
│   ├── services/
│   │   ├── productService.js
│   │   ├── profileService.js
│   │   ├── loginService.js
│   │   └── registerService.js
│   ├── index.js
│   ├── root.component.js
│   └── styles.css
├── package.json
└── webpack.config.js
```

## API Service Layer

This project separates component logic from API logic using a service layer. All fetch calls are managed in the src/services/ directory.

- **productService.js**: Handles all product-related CRUD operations.

- **profileService.js**: Handles updating user profile data.

- **loginService.js**: Handles the user login API call.

- **registerService.js**: Handles the user registration API call.

## Data Storage

All application data (users, products) is stored in the backend database.
The browser's localStorage is used only to store the logged-in user's data (storeUser) as a session token