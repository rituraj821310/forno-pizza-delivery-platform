# Forno — Server

Node + Express API backing the pizza delivery client, with MongoDB
(Mongoose) for storage and Socket.IO for live order tracking.

## Stack
- Express 4, Mongoose 8
- JWT auth (bcrypt-hashed passwords)
- Socket.IO for `order:updated` broadcasts to anyone tracking that order

## Getting started

```bash
npm install
# env vars are read from the project root .env (already created, edit as needed)
npm run seed   # optional: populates demo menu items + an admin account
npm run dev    # nodemon, http://localhost:5000
```

Demo admin login after seeding: `admin@forno.example` / `admin123`.

## Structure

- `config/` — env loading, MongoDB connection
- `models/` — `User`, `MenuItem`, `Order` (Mongoose schemas)
- `controllers/` — thin request handlers, one per resource
- `services/` — business logic (auth, order pricing/lifecycle) kept out of controllers
- `routes/` — Express routers, mounted under `/api/*` in `app.js`
- `middleware/` — `protect` (JWT auth), `adminOnly`, `notFound`, `errorHandler`
- `sockets/` — Socket.IO setup; `emitOrderUpdate()` is called from `orderService`
  whenever an order's status changes, broadcasting to the `order:<id>` room
- `jobs/seedMenu.js` — demo data seed script
- `utils/` — `asyncHandler`, `ApiError`, `generateToken`, `sanitizeUser`

## API overview

| Method | Path                     | Auth        | Description                  |
|--------|--------------------------|-------------|-------------------------------|
| POST   | /api/auth/register       | —           | Create account, returns JWT   |
| POST   | /api/auth/login          | —           | Log in, returns JWT           |
| GET    | /api/auth/me             | user        | Current user                  |
| PUT    | /api/auth/profile        | user        | Update name/phone/address     |
| GET    | /api/menu                | —           | List dishes (`?category=&search=`) |
| POST   | /api/menu                | admin       | Create a dish                 |
| PUT    | /api/menu/:id            | admin       | Update a dish                 |
| DELETE | /api/menu/:id            | admin       | Remove a dish                 |
| POST   | /api/orders              | user        | Place an order                |
| GET    | /api/orders/me           | user        | My order history               |
| GET    | /api/orders/:id          | owner/admin | Order detail                  |
| GET    | /api/orders              | admin       | All orders (`?status=`)       |
| PATCH  | /api/orders/:id/status   | admin       | Update order status           |
| PATCH  | /api/orders/:id/cancel   | owner/admin | Cancel (only while placed/confirmed) |
| GET    | /api/users                | admin       | List users                    |
| PATCH  | /api/users/:id/role      | admin       | Change a user's role          |
| DELETE | /api/users/:id           | admin       | Remove a user                 |

Pricing (delivery fee, tax, total) is always recomputed server-side in
`services/orderPricingService.js` — the client's numbers are for display only
and are never trusted directly.
