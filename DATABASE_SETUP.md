# Database & Environment Setup Guide

This guide gets the MongoDB database and the JWT authentication keys running
locally so both the backend API and frontend can boot successfully.

## 1. Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Atlas**: create a free cluster at https://www.mongodb.com/cloud/atlas
    and copy its connection string

## 2. Backend environment variables

Copy the example file and fill in real values:

```bash
cd backend
cp .env.example .env
```

`backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/gym_membership_system
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=1d
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

- **MONGO_URI**: for Atlas, use the connection string from the cluster's
  "Connect your application" dialog, e.g.
  `mongodb+srv://user:pass@cluster0.mongodb.net/gym_membership_system`.
- **JWT_SECRET**: this is what the server uses to sign and verify JWTs.
  Generate one quickly with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- **JWT_EXPIRES_IN**: token lifetime (e.g. `1d`, `12h`).

## 3. Install & run the backend

```bash
cd backend
npm install
npm run dev
```

On success the terminal prints:

```
MongoDB connected: 127.0.0.1/gym_membership_system
GMS API server listening on port 5000
```

Verify the database connection independently at any time by hitting the
health check route:

```bash
curl http://localhost:5000/api/health
# -> {"status":"ok"}
```

## 4. Frontend environment variables

```bash
cd frontend
cp .env.example .env
```

`frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 5. Install & run the frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 — you should be redirected to `/login`. Create an
account from the Sign Up page, which calls `POST /api/auth/signup`, receives
a JWT, and lands you on the protected `/dashboard` route.

## 6. Confirming everything is wired together

1. Sign up a new user — a document appears in the `users` collection.
2. Add a membership from the dashboard form — a document appears in the
   `memberships` collection with your user's `_id` as `owner`.
3. Refresh the page — the membership list still loads, proving the JWT
   persisted and was sent as `Authorization: Bearer <token>` on the
   follow-up `GET /api/memberships` request.
4. Log out and try to visit `/dashboard` directly — you are redirected back
   to `/login`, confirming route protection.
