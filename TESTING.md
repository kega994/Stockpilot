# StockPilot testing guide

This project now includes automated backend tests (Jest) and frontend tests (Vitest + React Testing Library), plus a manual regression checklist.

## Install dependencies

Run these in separate terminals:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

## Run automated tests

Backend:
```bash
cd server
npm test
npm run test:watch
npm run test:coverage
```

Frontend:
```bash
cd client
npm test
npm run test:watch
```

The backend tests cover required registration fields, duplicate registration, password hashing, valid/invalid login, JWT authentication, and admin authorization. The frontend tests cover adding basket items, increasing/decreasing quantities, stock limits, and item removal.

## Manual test checklist

Run the application using the existing project setup, with PostgreSQL configured and the server/client running. Use a dedicated test database and test accounts; do not use production data.

| ID | Area | Test | Expected result |
|---|---|---|---|
| M01 | Registration | Submit without email or password | Validation error; no account created |
| M02 | Registration | Register a new email | Account created; password stored hashed |
| M03 | Registration | Register the same email again | Conflict message; no duplicate account |
| M04 | Login | Submit empty credentials | Validation error |
| M05 | Login | Submit incorrect password | Login rejected |
| M06 | Login | Submit correct credentials | Login succeeds and token is returned |
| M07 | Access control | Open protected brand/category endpoints without token | Request rejected |
| M08 | Access control | Use a non-admin token to create/update/delete a product | Request rejected |
| M09 | Products | View product listing and product details | Correct product data and image display |
| M10 | Products | Create a product with required fields and image as admin | Product is created |
| M11 | Products | Create another product with an existing SKU | Duplicate SKU rejected |
| M12 | Products | Edit product with and without replacing image | Changes saved; existing image retained when omitted |
| M13 | Products | Delete an existing product | Product removed; missing ID returns not found |
| M14 | Basket | Add same product more than once | Quantity increments |
| M15 | Basket | Increase quantity beyond available stock | Quantity remains at stock limit and warning appears |
| M16 | Basket | Decrease quantity to zero | Item removed from basket |
| M17 | Checkout | Submit an empty basket | Checkout rejected with empty-basket message |
| M18 | Checkout | Submit incomplete customer details | Validation error |
| M19 | Checkout | Order quantity exceeds available stock | Order rejected; stock remains unchanged |
| M20 | Checkout | Place valid order | Order created, totals calculated, stock reduced |
| M21 | Orders | Retrieve an existing order | Order and its items returned |
| M22 | Orders | Retrieve an unknown order ID | Not-found response |
| M23 | UI | Check home, products, login, basket and checkout on desktop/mobile | Pages render and navigation works |

## Important notes

- Automated backend tests mock PostgreSQL and bcrypt, so they do not require a running database. They verify controller/middleware behaviour, not the live database schema or SQL compatibility.
- The manual checklist includes real database and end-to-end workflows that should be run against a separate test database.
- The current order endpoint is not authenticated in the supplied source. Review whether that is intentional before deploying.
- The frontend suite currently focuses on basket behaviour. Add page-level and browser end-to-end tests as the next stage.
