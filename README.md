# UniSphere ERP

UniSphere ERP is a premium full-stack University Management System built with a bright SaaS-style React frontend and a Python-powered Flask backend. It includes role-based login, student onboarding, attendance, results, notices, fee visibility, exports, and modern dashboard experiences for admin, staff, and students.

## Included In This Package

- `frontend/` React + Vite + Tailwind CSS + Framer Motion + Recharts
- `backend/` Flask REST API with JWT auth and Python business logic
- `University_Management_System_Report.pdf` professional project report
- `netlify.toml` frontend deployment config for Netlify
- `render.yaml` backend deployment starter config for Render

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Backend: Flask, SQLAlchemy, Flask-JWT-Extended, ReportLab, Pandas
- Database: MySQL-ready through `DATABASE_URL`, SQLite fallback for local/demo use
- Authentication: JWT with role-based access control

## Main Features

- Admin login, staff login, and student login
- Student management and onboarding
- Attendance entry and tracking
- Result publishing and GPA handling
- Fee structure and due visibility
- Hostel, library, mess card, and ID card allocation views
- Notice publishing to the public landing page and portals
- PDF and Excel export support
- Premium responsive university ERP interface

## Local Run

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python run.py
```

Backend runs on:

- `http://localhost:5001/api`
- health check: `http://localhost:5001/api/health`

### Frontend

Create `frontend/.env` from `frontend/.env.example` and keep this for local use:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## Demo Credentials

- Admin: `admin@unisphere.edu` / `Admin@123`
- Staff: `teacher@unisphere.edu` / `Teacher@123`
- Student: `student@unisphere.edu` / `Student@123`

## Frontend Deployment On Netlify

Use these settings in Netlify:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Environment variable:

- `VITE_API_BASE_URL=https://your-backend-domain/api`

The included `netlify.toml` already matches this setup.

## Backend Deployment

Netlify is ideal for the frontend, but the main Flask backend should be deployed on a Python-friendly host such as Render or Railway.

Recommended Render setup:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn run:app`

Environment variables:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `FRONTEND_URL=https://your-netlify-site.netlify.app`

The included `render.yaml` is a starter deployment config for this backend.

## Notes

- `backend/instance/unisphere.db` is included as a demo database snapshot.
- Replace SQLite with MySQL in production by setting `DATABASE_URL`.
- Do not commit real `.env` files with private secrets.
