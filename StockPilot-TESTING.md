# StockPilot — Testing Guide

This document explains how to install and run StockPilot's current automated tests and provides a manual regression checklist.

## 1. Testing tools

| Tool | Used for |
|---|---|
| Jest | Backend controller and middleware tests |
| Vitest | Frontend test runner |
| React Testing Library | Rendering React components and simulating user interactions |
| jsdom | Browser-like DOM environment for frontend tests |
| Supertest | Dependency available for future Express HTTP integration tests; not currently used by the existing tests |

## 2. Install dependencies

Install backend and frontend dependencies separately.

Backend:

```bash
cd server
npm install
```

Frontend, in another terminal:

```bash
cd client
npm install
```

## 3. Run backend tests

From the `server` directory:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

### Backend test files

#### `server/tests/authController.test.js`

Tests the authentication controller's response to:

- Registration with missing credentials.
- Registration with an email that already exists.
- Successful registration and password hashing.
- Login with missing credentials.
- Login with valid credentials and JWT generation.
- Login with an incorrect password.

The PostgreSQL pool and bcrypt are mocked. This keeps these tests isolated and repeatable, but it does not verify a live database connection, SQL schema or actual bcrypt implementation.

#### `server/tests/authMiddleware.test.js`

Tests:

- Requests without a bearer token are rejected.
- Invalid tokens are rejected.
- Valid tokens are accepted and their payload is attached to the request.
- Admin users are allowed through admin authorization.
- Non-admin users are rejected by admin authorization.

## 4. Run frontend tests

From the `client` directory:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

### Frontend test file

#### `client/src/context/BasketContext.test.jsx`

Tests the basket context through a small React test component:

- Adding a product to an empty basket.
- Increasing a product's basket quantity.
- Preventing the basket quantity from exceeding available stock.
- Removing a product when its quantity is decreased from one.

The test environment is configured in `client/vitest.config.js`, with shared test setup in `client/src/test/setup.js`.

## 5. Manual regression checklist

Run the application against a development database with test data. Do not use production accounts or production data.

| ID | Area | Test | Expected result |
|---|---|---|---|
| M01 | Registration | Submit without an email or password | Validation error; no account created |
| M02 | Registration | Register a new email | Account created; password stored hashed |
| M03 | Registration | Register the same email again | Duplicate email rejected |
| M04 | Login | Submit empty credentials | Validation error |
| M05 | Login | Submit an incorrect password | Login rejected |
| M06 | Login | Submit correct credentials | Login succeeds and token is returned |
| M07 | Access control | Request protected brand/category endpoints without a token | Request rejected |
| M08 | Access control | Use a non-admin token to create, update or delete a product | Request rejected |
| M09 | Products | View product listing and details | Correct product information is displayed |
| M10 | Products | Create a product with required fields and an image as admin | Product is created |
| M11 | Products | Create a product using an existing SKU | Duplicate SKU rejected |
| M12 | Products | Edit a product with and without replacing its image | Changes saved; existing image retained when no new image is uploaded |
| M13 | Products | Delete an existing product | Product is deleted; unknown ID returns not found |
| M14 | Basket | Add the same product more than once | Basket quantity increments |
| M15 | Basket | Increase quantity beyond available stock | Quantity stays within stock limit and warning appears |
| M16 | Basket | Decrease quantity from one | Product is removed from basket |
| M17 | Checkout | Submit an empty basket | Checkout rejected |
| M18 | Checkout | Submit incomplete customer details | Validation error |
| M19 | Checkout | Order more units than are in stock | Order rejected and stock remains unchanged |
| M20 | Checkout | Place a valid order | Order created, totals calculated and stock reduced |
| M21 | Orders | Retrieve an existing order | Order and its items are returned |
| M22 | Orders | Retrieve an unknown order ID | Not-found response |
| M23 | UI | Visit home, products, login, basket and checkout on desktop and mobile | Pages render and navigation works |

## 6. Important limitations and follow-up work

- The backend automated tests mock PostgreSQL and bcrypt. They do not run SQL against a real database.
- The frontend automated tests currently focus on basket behaviour.
- The manual checklist is a set of test instructions; those checks are not automatically executed by `npm test`.
- Product CRUD, checkout, order creation, stock reduction and database transaction behaviour still need automated tests.
- Supertest is installed but is not yet used by the current test files. It can be used when Express HTTP integration tests are added.
- Consider adding Playwright for browser end-to-end testing and GitHub Actions for continuous integration.

## 7. Before publishing

- Keep `.env` files and credentials out of Git.
- Use a separate test database for integration testing.
- Run `npm test` in both `server` and `client`.
- Review test output and investigate failures before merging changes.
