# 🏎 MUJ Car Rentals

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://muj-car-rentals.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Prisma](https://img.shields.io/badge/Database-Prisma-2D3748)](https://www.prisma.io/)

A premium, full-stack car rental platform tailor-made for students, featuring an advanced **Hybrid Machine Learning Recommendation Engine**.

🌐 **Live Website:** [https://muj-car-rentals.vercel.app/](https://muj-car-rentals.vercel.app/)

---

## ✨ Key Features

### 🧠 Intelligent Recommendations
Built with a custom **Hybrid Recommendation System** that combines:
- **Content-Based Filtering**: Recommends cars based on technical specifications and model similarity.
- **Collaborative Filtering**: Leverages SVD (Singular Value Decomposition) to predict user preferences based on booking history.
- **Hybrid Strategy**: Dynamically adjusts recommendations based on user interactions and rental trends.

### 🛡 Modern Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion (for smooth animations).
- **Authentication**: Secure student login system via NextAuth.
- **Backend (ML Service)**: FastAPI-powered microservice containerized with Docker.
- **Database**: PostgreSQL (hosted on Neon.tech) with Prisma ORM for type-safe queries.

### 💼 Admin & Student Dashboards
- **Student Portal**: Easy booking process, personalized car feeds, and trip history.
- **Admin Dashboard**: Real-time fleet management and booking oversight.

---

## 🛠 Architecture

The application is split into two specialized services:
1.  **Main Web App**: Handles UI, authentication, and rental logic (Next.js + Prisma).
2.  **ML API**: A dedicated Python service that processes datasets and serves real-time car recommendations (FastAPI).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (or Neon.tech account)

### Quick Setup

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/ppboy04/muj-car-rentals.git
    cd muj-car-rentals
    ```

2.  **Setup Frontend**:
    ```bash
    npm install
    npx prisma generate
    npm run dev
    ```

3.  **Setup ML Service**:
    ```bash
    cd ml-service
    pip install -r requirements.txt
    python scripts/train_real_data.py
    python api/main.py
    ```

---

## 🌎 Deployment Info

- **Frontend**: Deployed on [Vercel](https://vercel.com).
- **ML Service**: Containerized with **Docker** and deployed on [Render](https://render.com).
- **Database**: Serverless PostgreSQL on [Neon](https://neon.tech).

---

## 👨‍💻 Author

**Manipal University Jaipur Student Project**
Live at: [https://muj-car-rentals.vercel.app/](https://muj-car-rentals.vercel.app/)
