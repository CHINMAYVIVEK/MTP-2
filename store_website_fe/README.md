# Store Website Frontend

A microfrontend application for store owners to manage their products and user profile, all connected to a live backend API.

## Features

### Authentication

**Login Page**: Connects to a GET /stores/users/login endpoint for authentication.

**Register Page**: Connects to a POST /stores/users endpoint to create new users with validation.

### Product Management

- **Home Page**: Fetches and displays all of a user's products from the GET /stores/products API.

- **CRUD Operations**:

    - Create (POST): Add new products with a detailed form, including dynamic lists for attributes and images.

    - Read (GET): View product details in a modal.

    - Update (PUT/PATCH): Edit existing products. The app intelligently sends only the modified fields to the API.

    - Delete (DELETE): Remove products with a custom confirmation step.

- Product Fields: name, description, shortDescription, price, discountPrice, currency, quantity, weight, category, attributes (list), and images (list).

### Profile Management

**Profile Page**: View and edit the logged-in user's profile.

- Update (PUT): Sends only changed fields to the PUT /stores/users/{id} endpoint.

Profile Fields: firstName, lastName, storeName, email, phone, img_url, password (write-only), and a dynamic list of addresses (with sub-fields).


## Installation
```bash
npm install
```

## Running the Application
``` bash
npm start
```

## Technology Stack

- React 18
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