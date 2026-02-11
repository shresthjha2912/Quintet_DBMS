# Quintet - Unified Learning Platform

Quintet is a comprehensive course management system with a FastAPI backend and a Next.js frontend, integrated with Supabase PostgreSQL.

##  Quick Start

### 1. Prerequisites
- Python 3.13+
- Node.js & pnpm
- A Supabase PostgreSQL instance

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt # or use uv sync
```
Create a `.env` file in `backend/`:
```env
DATABASE_URL=your_supabase_pooler_url
SECRET_KEY=your_secret_key
ADMIN_EMAIL=admin@quintet.com
ADMIN_PASSWORD=admin123
```
Run the seed script to populate sample data:
```bash
python seed.py
```
Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```
The app will be available at `http://localhost:3000`.

##  Project Structure

- **`/backend`**: FastAPI application
  - `app/models`: SQLAlchemy database models (11 tables)
  - `app/routers`: Role-based API endpoints
  - `app/services`: Business logic and database operations
  - `seed.py`: Sample data population script
- **`/frontend`**: Next.js 14 application
  - `app/[role]`: Role-specific dashboards (Student, Instructor, Admin, Analyst)
  - `lib/api.ts`: Centralized API client
  - `components/ui`: Shadcn/UI component library

##  Role-Based Access

| Role | Access Level |
|---|---|
| **Admin** | Manage users, courses, and instructors |
| **Instructor** | Manage assigned courses and view student metrics |
| **Student** | Browse and enroll in courses, track progress |
| **Analyst** | Access system-wide analytics and visualizations |

##  Tech Stack
- **Backend**: FastAPI, SQLAlchemy, Pydantic, JWT, Bcrypt
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Recharts
- **Database**: Cloud PostgreSQL (Supabase)