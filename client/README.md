# Forno — Client

React + Vite frontend for the pizza delivery platform.

## Stack
- React 18 + React Router 6
- Tailwind CSS (custom "wood-fired" theme — see `tailwind.config.js`)
- Axios for API calls, Socket.IO client for live order tracking

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your server, defaults to /api
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`) —
adjust that if your Express server runs elsewhere.

## Structure

- `src/pages/auth` — login, register
- `src/pages/user` — home, menu, cart, checkout, order history/tracking, profile
- `src/pages/admin` — dashboard, order/menu/user management
- `src/context` — Auth and Cart providers (React Context + localStorage)
- `src/services` — one file per API resource, all going through `services/api.js`
- `src/hooks` — `useAuth`, `useCart`, `useFetch`, `useDebounce`
- `src/routes` — route table, `ProtectedRoute` (logged-in only), `AdminRoute`
- `src/components` — shared UI (Navbar, Footer, PizzaCard, order status, etc.)

## Notes for wiring up the API

Every service function assumes REST endpoints like `/api/auth/login`,
`/api/menu`, `/api/orders`, `/api/users` returning JSON. Menu page falls
back to demo data if the API isn't reachable yet, so the UI is browsable
before the backend is wired up.
