# StockPilot — Inventory Management & E-Commerce Platform

StockPilot is a full-stack inventory management and e-commerce application built to demonstrate end-to-end web development. It combines an inventory management system with a customer-facing storefront, allowing administrators to manage products and customers to browse products, add items to a basket, and place orders.

## Features

### Inventory Management
- Create, view, edit, and delete products.
- Manage product names, descriptions, prices, SKUs, and stock quantities.
- Associate products with brands and categories.
- Upload product images and store them in PostgreSQL.
- Validate product stock and handle SKU uniqueness.

### Storefront
- Browse available products.
- Search products by name, SKU, brand, and category.
- View individual product details.
- Add products to a basket.
- Increase or decrease basket quantities while respecting available stock.
- Store basket contents in browser local storage.

### Checkout & Orders
- Enter customer and delivery details.
- Validate checkout information.
- Create and persist customer orders.
- Calculate order subtotals, delivery charges, and totals on the backend.
- Check stock availability before confirming an order.
- Reduce product stock after a successful order.
- Store order items and prices for order history.
- Display an order confirmation with a unique order number.
- Retrieve order details when the confirmation page is refreshed.

### Authentication & Access Control
- User login and authentication.
- Role-based access control for administrative product management.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, React Router, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js, REST API |
| Database | PostgreSQL, SQL |
| Tools & Concepts | Git, GitHub, Fetch API, FormData, Multer, database transactions, browser local storage |

## Application Architecture

StockPilot uses a client-server architecture:

1. **Frontend:** React provides the storefront, basket, checkout, and inventory management interfaces.
2. **API communication:** The frontend communicates with the Express backend through REST API endpoints.
3. **Business logic:** The backend validates requests and handles product and order operations.
4. **Database:** PostgreSQL stores users, products, brands, categories, orders, and order items.
5. **Order processing:** During checkout, the backend verifies stock, creates the order and its items, and updates stock within a database transaction.

## Database Design

The application uses the following main tables:

| Table | Purpose |
|---|---|
| `users` | Stores user accounts, password hashes, and roles. |
| `products` | Stores product details, prices, SKUs, stock quantities, and image data. |
| `brands` | Stores product brands. |
| `categories` | Stores product categories. |
| `orders` | Stores customer and delivery details, totals, and order status. |
| `order_items` | Stores the products, prices, and quantities associated with each order. |

Products reference brands and categories. Order items reference their parent order and the relevant product.

## Getting Started

### Prerequisites

Before running StockPilot locally, make sure you have:

- Node.js and npm installed.
- PostgreSQL installed and running.
- Git installed.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

### 2. Configure the Database

1. Create a PostgreSQL database.
2. Create the required tables using the SQL schema maintained by the project.
3. Ensure the schema includes the required relationships, constraints, SKU and image columns.
4. Add initial brands and categories required by the application.

### 3. Configure Environment Variables

Create a `.env` file in the backend directory using the variable names expected by your database connection and authentication code.

For example:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_secret
```

These are example variable names. Check your backend code and database configuration to confirm which variables it actually reads.

**Never commit real database credentials, JWT secrets, or other sensitive values to GitHub.**

### 4. Install Dependencies

In the backend directory:

```bash
npm install
```

In the frontend directory:

```bash
npm install
```

### 5. Start the Backend

From the backend directory, run:

```bash
npm run dev
```

This uses the development script configured in the backend's `package.json`.

### 6. Start the Frontend

From the frontend directory, run:

```bash
npm run dev
```

Open the local URL displayed by the frontend development server.

Ensure the frontend API configuration points to your local backend and that the backend can connect to PostgreSQL.

## API Overview

| Resource | Base Route | Purpose |
|---|---|---|
| Products | `/api/products` | Retrieve and manage products. |
| Orders | `/api/orders` | Create orders and retrieve order details. |

Product creation, editing, and deletion require the relevant authentication and authorization permissions.

The application also uses brand and category services to populate product form dropdowns.

## Key Technical Decisions

### Server-Side Stock Validation
Stock availability is checked by the backend rather than relying exclusively on frontend validation. This prevents checkout from trusting basket quantities supplied by the browser.

### Transactional Order Processing
Order processing uses a database transaction to group order creation, order-item insertion, and stock updates together. If processing fails, the transaction can be rolled back to avoid leaving a partially completed order.

### Product Image Storage
Product images are uploaded through the backend and stored in PostgreSQL as binary data, together with their MIME types. The API formats images for display in the frontend.

### Persistent Order Confirmation
The order confirmation page can retrieve an order from the backend using its ID. This allows order details to be loaded again after a page refresh.

## Future Improvements

Potential future enhancements include:

- Deploying the frontend, backend, and database.
- Adding automated tests for API endpoints and checkout logic.
- Improving validation and error handling.
- Adding order history and order status management.
- Improving image previews and upload validation.
- Adding pagination and more advanced product filtering.
- Improving accessibility and responsive behaviour.

## Project Status

StockPilot is a portfolio project demonstrating full-stack application development, relational database design, REST API development, inventory management, and e-commerce order processing.

## Author

Gergo Szima

- GitHub: https://github.com/kega994/Stockpilot
- LinkedIn: https://www.linkedin.com/in/gergo-szima-0b3a12332/

