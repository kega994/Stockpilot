# StockPilot

A full-stack inventory and product management application built with React, Node.js, Express and PostgreSQL.

StockPilot provides product browsing and management, stock-aware shopping basket functionality, customer checkout and order processing. It also includes role-based access control for administrative product management.

## Features

- **Authentication:** user registration and login using hashed passwords and JSON Web Tokens (JWT).
- **Role-based access:** admin-only product creation, editing and deletion.
- **Product catalogue:** browse products and view individual product details.
- **Inventory management:** track SKU and available product quantities.
- **Brands and categories:** retrieve and display product brands and categories.
- **Shopping basket:** add products, change quantities and prevent basket quantities from exceeding available stock.
- **Checkout and orders:** submit customer details, create orders and update stock quantities.
- **Product images:** store product image data and return browser-ready image data.

## Technology stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL (`pg`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`), bcrypt |
| File uploads | Multer |
| Backend testing | Jest |
| Frontend testing | Vitest, React Testing Library, jsdom |

## Project structure

```text
Stockpilot/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── BasketContext.test.jsx
│   │   ├── pages/
│   │   ├── services/
│   │   └── test/
│   │       └── setup.js
│   ├── vitest.config.js
│   └── package.json
├── server/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── tests/
│   │   ├── authController.test.js
│   │   └── authMiddleware.test.js
│   ├── jest.config.js
│   └── package.json
├── TESTING.md
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Git (if cloning the repository)

## Getting started

### 1. Get the project

Clone the repository and enter the project directory:

```bash
git clone <your-repository-url>
cd Stockpilot
```

Replace `<your-repository-url>` with the HTTPS or SSH URL of your GitHub repository.

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure the backend environment

Create a `server/.env` file and configure the database connection and JWT secret using the variable names expected by `server/db/db.js` and the authentication controller:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
```

Create and initialise the PostgreSQL database using the SQL schema supplied with your project, if available. The application needs the tables used by its controllers, including users, products, brands, categories, orders and order_items.

**Security:** Never commit `.env` files, passwords, database credentials or real JWT secrets to GitHub. Use a separate database for development and testing.

### 4. Install frontend dependencies

Open a second terminal from the project root:

```bash
cd client
npm install
```

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend is configured to use port `3000` by default.

### 6. Start the frontend

From the `client` directory, in a second terminal:

```bash
npm run dev
```

Vite will print the local development URL in the terminal (commonly `http://localhost:5173`).

The frontend API service is currently configured to call `https://stockpilot-api-tn3t.onrender.com/api`.

## Automated testing

StockPilot has automated tests for selected backend authentication/security behaviour and frontend basket behaviour.

### Backend tests — Jest

From the `server` directory:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate a coverage report:

```bash
npm run test:coverage
```

The current backend tests cover:

- Registration rejects missing email or password.
- Registration rejects an email that already exists.
- Registration hashes a new user's password before storing it.
- Login rejects missing credentials.
- Login returns a JWT for valid credentials.
- Login rejects an incorrect password.
- Authentication middleware rejects a missing bearer token.
- Authentication middleware rejects an invalid token.
- Authentication middleware accepts a valid token.
- Admin authorization allows an admin and rejects a non-admin user.

### Frontend tests — Vitest and React Testing Library

From the `client` directory:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The current frontend tests cover:

- Adding a product to an empty basket.
- Increasing the quantity of a basket item.
- Preventing the basket quantity from exceeding available stock.
- Removing an item when its quantity is decreased from one to zero.

For the manual regression checklist and further detail, see [TESTING.md](./TESTING.md).

## Screenshots

Screenshots make it easier for visitors to understand the application before running it. Add genuine screenshots of your running StockPilot application to a folder such as `docs/screenshots/`, then embed them here. Suggested screenshots:

- Home page / product catalogue
- Product details
- Admin dashboard or product management
- Shopping basket
- Checkout or order confirmation

No screenshots are included yet; add images captured from your own running application before publishing this section.

## Current testing scope and limitations

- Backend controller tests mock PostgreSQL and bcrypt. They test controller and middleware behaviour without connecting to a live PostgreSQL database.
- The current frontend tests focus on the basket context; they do not exercise every page or a real browser session.
- Product CRUD, live database integration, checkout and order workflows are listed in the manual checklist but do not yet have automated coverage.
- Supertest is included as a backend testing dependency for future HTTP/API integration tests; the current backend tests directly test controllers and middleware rather than sending HTTP requests through the Express application.
- Use a dedicated test database and test accounts for manual or future integration tests. Do not run destructive tests against production data.

## Future improvements

Potential next testing milestones include:

1. Add product controller tests.
2. Add PostgreSQL integration tests using a dedicated test database.
3. Add checkout and order tests, including stock reduction and rollback scenarios.
4. Add browser end-to-end tests with Playwright.
5. Add a GitHub Actions workflow to run automated tests on every push and pull request.

## Contributing

If you want to contribute, create a branch for your change, make the update, run the relevant tests and open a pull request describing what changed.

## License

Add the licence that applies to this project before publishing or accepting external contributions.
