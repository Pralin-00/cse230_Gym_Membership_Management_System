# FitTrack — Gym Membership Management System

A full-stack CRUD application for tracking gym memberships, built with a
JWT-authenticated Express/MongoDB REST API and a React (Vite) frontend.



## Features

- Email/password signup & login issuing signed JWTs
- Bearer-token auth middleware protecting every `/api/memberships` route
- Protected `/dashboard` route on the frontend that redirects unauthenticated
  visitors to `/login`
- Full CRUD on membership records (title, description, due date, completion
  status) scoped to the logged-in user
- Loading skeletons while data is in flight and a dismissible error banner
  for failed requests

## Quick start

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for full environment setup.
Short version:

```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend (new terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```

Then open http://localhost:5173.

## API reference

| Method | Route                    | Auth required | Description                     |
|--------|---------------------------|:---:|----------------------------------|
| POST   | `/api/auth/signup`        |  -  | Create an account, returns JWT   |
| POST   | `/api/auth/login`         |  -  | Log in, returns JWT              |
| GET    | `/api/auth/me`            |  ✅  | Get the current user             |
| GET    | `/api/memberships`        |  ✅  | List the user's memberships      |
| POST   | `/api/memberships`        |  ✅  | Create a membership              |
| PATCH  | `/api/memberships/:id`    |  ✅  | Update fields / toggle completion|
| DELETE | `/api/memberships/:id`    |  ✅  | Delete a membership              |

## Tech stack

- **Backend**: Node.js, Express, Mongoose, jsonwebtoken, bcryptjs
- **Frontend**: React 18, React Router, Axios, Vite
