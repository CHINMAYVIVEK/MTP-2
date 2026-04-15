# QCommerce Website

**QCommerce Website** is the main **frontend portal** and entry point for the **micro-frontend ecosystem** of the QCommerce platform. This project orchestrates and renders the various micro-frontends for customers, store owners, and admin users, delivering a seamless, unified user experience across the platform.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Required Repositories](#required-repositories)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [Quick Access](#quick-access)

---

## Quick Access

When the project is running, you can access the different interfaces via the main hub:

- **Customer-Facing Site**: [http://localhost:8505/](http://localhost:8505/)
- **Store-Facing Site (Merchant Portal)**: [http://localhost:8505/store](http://localhost:8505/store)
- **Direct Login**: [http://localhost:8505/store/login](http://localhost:8505/store/login)

---

## Overview

QCommerce is a **modular, scalable e-commerce platform** built with **micro-frontend architecture**. This main frontend project is responsible for:

* Hosting and orchestrating multiple micro-frontends dynamically.
* Acting as a single unified entry point for all user roles (customer, store, admin).
* Handling seamless navigation and route management between micro-frontends.
* Ensuring consistent branding, styling, and user experience across all modules.

---

## Features

* **Micro-frontend orchestration**: Dynamically integrates multiple frontend apps into a cohesive interface.
* **Role-based views**: Provides distinct experiences for customers, store managers, and administrators.
* **Responsive design**: Fully optimized for desktop, tablet, and mobile devices.
* **Extensible architecture**: Easy to add or replace micro-frontends without disrupting the main portal.
* **Unified routing and navigation**: Centralizes route management for all integrated micro-frontends.

---

## Required Repositories

The QCommerce platform is built as a **micro-frontend ecosystem** with clearly separated frontend and backend repositories. Each micro-frontend can be developed, deployed, and maintained independently, while the main portal orchestrates them for a seamless user experience.

### Frontend Repositories

| Type              | Repository            |
| ----------------- | --------------------- |
| Customer Frontend | `customer_website_fe` |
| Store Frontend    | `store_website_fe`    |
| Admin Frontend    | `admin_website_fe`    |

### Backend Repositories

| Type             | Repository            |
| ---------------- | --------------------- |
| Customer Backend | `customer_website_be` |
| Store Backend    | `store_website_be`    |
| Admin Backend    | `admin_website_be`    |

> **Note:** Start backend services first to ensure all APIs are available, then start the corresponding frontend micro-applications. Finally, start the **main QCommerce portal** to orchestrate the micro-frontends.


---

## Installation

>  Each frontend repository also has its own installation steps. Refer to the README of each frontend for exact instructions:

---

## Running the Project

> **Important:** To avoid runtime issues, always start the individual micro-frontends **before** starting this main QCommerce frontend.

### Recommended Startup Order

1. Start **backend services** (if required) for each micro-frontend:

   * Customer Backend
   * Store Backend
   * Admin Backend

2. Start **frontend micro-apps** individually:

   ```bash
   # Customer frontend
   cd customer_website_fe
   npm install && npm start

   # Store frontend
   cd store_website_fe
   npm install && npm start

   # Admin frontend
   cd admin_website_fe
   npm install && npm start
   ```

3. Finally, start the **main QCommerce website**:

   ```bash
   cd qcommerce_website
   npm install && npm start
   ```

* Access the portal at `http://localhost:8505`.
* All micro-frontends should now load correctly within the main app.

---
