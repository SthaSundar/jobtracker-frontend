# JobTracker — Frontend

React frontend for JobTracker — a personal job application tracker. Talks to the [JobTracker backend](https://github.com/SthaSundar/jobtracker-backend) (Django REST Framework + MySQL) via a JWT-authenticated API.

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand (auth state)
- React Hook Form + Zod (form handling & validation)
- Axios

## Features
- JWT authentication — register, login, logout
- Protected routing — Dashboard requires authentication, redirects to login otherwise
- Client-side form validation with clear server-side error handling
- Axios interceptor automatically attaches the access token to every authenticated request

## Setup

1. Clone the repo
2. Install dependencies:
```
   npm install
```
3. Make sure the [backend](https://github.com/SthaSundar/jobtracker-backend) is running locally at `http://127.0.0.1:8000`
4. Start the dev server:
```
   npm run dev
```
5. Open `http://localhost:5173`

## Project Structure

```
src/
├── api/          # Axios instance + interceptors
├── components/   # Reusable components (ProtectedRoute, etc.)
├── layouts/       # Shared page layouts (nav bar, etc.)
├── pages/        # Route-level components (Dashboard, Login, Register)
├── schemas/      # Zod validation schemas
└── store/        # Zustand stores (auth state)
```

## Routes

| Path | Page | Protected |
|---|---|---|
| `/` | Dashboard | Yes — redirects to `/login` if not authenticated |
| `/login` | Login | No |
| `/register` | Register | No |