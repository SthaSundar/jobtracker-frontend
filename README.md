# JobTracker — Frontend

React frontend for JobTracker — a personal job application tracker. Talks to the [JobTracker backend](https://github.com/SthaSundar/jobtracker-backend) (Django REST Framework + MySQL) via a JWT-authenticated API.

**🔗 Live app:** [jobtracker-frontend-one.vercel.app](https://jobtracker-frontend-one.vercel.app)
**Demo login:** `demo` / *(see below or request credentials)* — or register your own account, it's free and instant.

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand (auth state)
- React Hook Form + Zod (form handling & validation)
- Axios
- Recharts (status breakdown & applications-over-time charts)
- Sonner (toast notifications)

## Features
- JWT authentication — register, login, logout
- Protected routing — Dashboard requires authentication, redirects to login otherwise
- Client-side form validation with clear server-side error handling
- Axios interceptor automatically attaches the access token to every authenticated request
- Search and status filtering on the applications list
- Dashboard charts (status breakdown pie chart, applications-over-time bar chart)
- Styled delete confirmation modal (instead of the native browser `confirm()` dialog)

## Live Deployment

Deployed on **Vercel**, auto-deploying from the `main` branch on every push.

| | |
|---|---|
| **Frontend** | [jobtracker-frontend-one.vercel.app](https://jobtracker-frontend-one.vercel.app) (Vercel) |
| **Backend API** | [jobtracker-backend-qv7a.onrender.com](https://jobtracker-backend-qv7a.onrender.com) (Render) |
| **API Docs (Swagger)** | [jobtracker-backend-qv7a.onrender.com/api/docs/](https://jobtracker-backend-qv7a.onrender.com/api/docs/) |

> **Note:** the backend runs on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after idle time may take 30–60 seconds to respond while it wakes up — this is expected, not a bug.

## Local Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
   (Point this at the live backend instead — `https://jobtracker-backend-qv7a.onrender.com/api` — if you don't want to run the backend locally.)
4. Make sure the [backend](https://github.com/SthaSundar/jobtracker-backend) is running locally at `http://127.0.0.1:8000` (or skip this if using the live API URL above)
5. Start the dev server:
   ```
   npm run dev
   ```
6. Open `http://localhost:5173`

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://127.0.0.1:8000/api` (local) or `https://jobtracker-backend-qv7a.onrender.com/api` (production) |

## Project Structure

```
src/
├── api/          # Axios instance + interceptors (attaches JWT to every request)
├── components/   # Reusable components (ProtectedRoute, ConfirmModal, StatusStamp, etc.)
├── layouts/      # Shared page layouts (nav bar, etc.)
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

## Deployment Notes

- Hosted on **Vercel**, framework preset `Vite`, auto-deploys on push to `main`
- `VITE_API_URL` is set as a Vercel environment variable, pointing to the live Render backend — the codebase itself never hardcodes an environment-specific URL
- CORS on the backend is explicitly configured to trust this Vercel domain (see backend README)

## Known Limitations

- Resume file uploads are stored on the backend's ephemeral filesystem (Render free tier) — uploaded files do not persist across backend redeploys. A production fix would use S3 or Cloudinary for persistent storage.