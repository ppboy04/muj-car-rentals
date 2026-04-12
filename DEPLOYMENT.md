# Deployment Guide for MUJ Car Rentals

This project consists of two parts:
1. **Frontend**: Next.js (App Router)
2. **ML Service**: FastAPI (Python)

To deploy the project online for free or low cost, follow these steps:

## 1. Deploy the ML Service (FastAPI)
We recommend using **Render** (render.com) or **Railway** (railway.app) because they support Docker easily.

### Option A: Render
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Select the `ml-service` directory as the "Root Directory".
4. Render will automatically detect the `Dockerfile`.
5. Add Environment Variables:
   - `FRONTEND_URL`: URL of your deployed frontend (e.g., `https://your-app.vercel.app`)
6. Deploy! Copy the URL provided by Render (e.g., `https://muj-ml-service.onrender.com`).

---

## 2. Deploy the Frontend (Next.js)
We recommend using **Vercel** (vercel.com).

1. Create a new project on Vercel and connect your GitHub repository.
2. Set the "Root Directory" to the root of the repo (or leave it as `./`).
3. Add Environment Variables:
   - `DATABASE_URL`: Your database connection string.
     - *Note: For production, do NOT use SQLite (`dev.db`). Use a free PostgreSQL database from **Neon.tech**, **Supabase**, or **Vercel Postgres**.*
   - `NEXT_PUBLIC_ML_API_URL`: The URL of your ML Service (from Step 1).
   - `NEXTAUTH_SECRET`: A random string for security.
   - `NEXTAUTH_URL`: Your frontend URL.
4. Deploy!

---

## 3. Database Migration (Optional but Recommended)
If you switch to PostgreSQL (recommended for production):
1. Update `DATABASE_URL` in your local `.env`.
2. Run `npx prisma db push` to create the tables in the new database.
3. Run `npm run migrate-data` to populate the production database with the initial car data.
