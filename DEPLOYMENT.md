# 🚀 Deploying MUJ Car Rentals to Production

This guide will help you move your application from your local machine to the cloud.

## 📋 Prerequisites
1. A **GitHub** account with your code pushed to a repository.
2. A **Vercel** account (for Frontend).
3. A **Render** or **Railway** account (for ML Service).
4. A **Neon.tech** or **Supabase** account (for PostgreSQL Database).

---

## 🏗 Step 1: Set Up Your Database (PostgreSQL)
*Next.js needs a real database to store users and bookings in production.*

1. **Create a Database**: Go to [Neon.tech](https://neon.tech) and create a free PostgreSQL project.
2. **Copy Connection String**: Copy the "Connection String" (it looks like `postgresql://user:pass@host/dbname`).
3. **Local Prep**: 
   - Open your local `.env` file.
   - Temporarily change `DATABASE_URL` to your new Neon string.
   - Run: `npx prisma db push` (This creates the tables in the cloud).
   - Run: `npm run migrate-data` (This seeds the cloud database with default cars and admin).
   - *Important: Change your local `.env` back to `file:./dev.db` after this.*

---

## 🧠 Step 2: Deploy the ML Service (FastAPI)
*The recommendation engine runs as a separate service.*

1. **Sign in to Render**: Go to [dashboard.render.com](https://dashboard.render.com).
2. **New Web Service**: Click `New` -> `Web Service`.
3. **Connect GitHub**: Select your repository.
4. **Configuration**:
   - **Root Directory**: `ml-service`
   - **Runtime**: `Docker` (Render will detect the `Dockerfile` we prepared).
5. **Environment Variables**:
   - `FRONTEND_URL`: `https://your-frontend.vercel.app` (or `*` for testing).
6. **Deploy**: Wait for the build to finish. It will automatically train the models during the build process!
7. **Copy URL**: Save the service URL (e.g., `https://muj-ml.onrender.com`).

---

## 🌐 Step 3: Deploy the Frontend (Next.js)
*The main app that users see.*

1. **Sign in to Vercel**: Go to [vercel.com](https://vercel.com).
2. **Import Project**: Select your repository.
3. **Configuration**:
   - **Root Directory**: Leave it as default (the whole repo).
4. **Environment Variables**:
   - `DATABASE_URL`: Your Neon/PostgreSQL connection string.
   - `NEXT_PUBLIC_ML_API_URL`: Your Render URL (from Step 2).
   - `NEXT_AUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Your Vercel app URL (e.g., `https://muj-car-rentals.vercel.app`).
5. **Deploy**: Click `Deploy`.

---

## ✅ Step 4: Verification
1. Visit your Vercel URL.
2. Log in with the student account (`student@jaipur.manipal.edu`).
3. If "Recommended for You" appears, your deployment was successful! 🥳

### 🆘 Common Issues
- **CORS Error**: Ensure `FRONTEND_URL` on Render matches your Vercel domain.
- **Prisma Error**: Ensure `DATABASE_URL` is correct and you ran `db push`.
