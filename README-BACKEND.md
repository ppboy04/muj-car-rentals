# MUJ Car Rentals - Full Stack Setup

## 🚀 Backend & Database Integration Complete!

Your car rental application has been successfully upgraded with:

- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **Type Safety**: Full TypeScript integration

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── register/route.ts        # User registration
│   │   ├── cars/
│   │   │   ├── route.ts                 # Cars CRUD
│   │   │   └── [id]/route.ts           # Individual car operations
│   │   ├── bookings/route.ts           # Bookings management
│   │   └── discount/route.ts           # Discount management
│   └── providers.tsx                    # NextAuth session provider
├── lib/
│   ├── auth.ts                         # NextAuth configuration
│   ├── prisma.ts                       # Prisma client
│   └── api-config.ts                   # API utilities
├── prisma/
│   └── schema.prisma                   # Database schema
├── scripts/
│   ├── migrate-data.ts                 # Data migration script
│   └── setup.ts                        # Automated setup
└── types/
    └── next-auth.d.ts                  # NextAuth type extensions
```

## 🛠 Setup Instructions

### 1. Start the Database

First, start your Prisma PostgreSQL server:

```bash
npx prisma dev
```

Keep this running in a separate terminal.

### 2. Setup Database Schema

In a new terminal, push the database schema:

```bash
npm run db:push
```

### 3. Seed Initial Data

Run the migration script to populate the database:

```bash
npm run migrate-data
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and your app will now use the database!

## 👥 Default Users

The migration creates these test accounts:

**Admin Account:**
- Email: `admin@muj.manipal.edu`
- Password: `admin123`
- Role: Admin (can manage cars and view all bookings)

**Student Account:**
- Email: `student@muj.manipal.edu`
- Password: `user123`
- Role: User (can book cars and view own bookings)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login (handled by NextAuth)
- `POST /api/auth/signout` - Logout (handled by NextAuth)

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create car (admin only)
- `GET /api/cars/[id]` - Get specific car
- `PUT /api/cars/[id]` - Update car (admin only)
- `DELETE /api/cars/[id]` - Delete car (admin only)

### Bookings
- `GET /api/bookings` - Get bookings (user: own, admin: all)
- `POST /api/bookings` - Create booking (authenticated users)

### Discount
- `GET /api/discount` - Get current discount percentage
- `POST /api/discount` - Update discount (admin only)

## 🔄 Migration Details

### What Changed:

1. **Data Storage**: Moved from localStorage to PostgreSQL
2. **Authentication**: Replaced custom auth with NextAuth.js
3. **API Layer**: Added proper REST API with validation
4. **Type Safety**: Enhanced types with database relationships

### Your Hooks Updated:

- `useAuth()` - Now uses NextAuth sessions
- `useCars()` - Now fetches from `/api/cars`
- `useBookings()` - Now fetches from `/api/bookings`
- `useDiscount()` - Now fetches from `/api/discount`

## 🏗 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role Role DEFAULT 'user',
  muj_id TEXT UNIQUE,
  official_email TEXT,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cars table
CREATE TABLE cars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  type CarCategory NOT NULL,
  hourly_rate DECIMAL NOT NULL,
  daily_rate DECIMAL NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  car_id TEXT REFERENCES cars(id) ON DELETE CASCADE,
  car_name TEXT NOT NULL,
  car_model TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  unit BookingUnit NOT NULL,
  quantity INTEGER NOT NULL,
  price_before_discount DECIMAL NOT NULL,
  discount_applied DECIMAL NOT NULL,
  final_price DECIMAL NOT NULL,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  muj_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `NEXTAUTH_SECRET` - Generate a secure secret
   - `NEXTAUTH_URL` - Your production domain

### Environment Variables

```env
# Production
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-super-secure-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

## 🛠 Development Commands

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:studio     # Open Prisma Studio (GUI)

# Data
npm run migrate-data  # Seed database with initial data
npm run setup         # Complete setup (all-in-one)

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 🔍 Testing the Integration

1. **Login/Registration**: Try creating a new account
2. **Car Management**: As admin, add/edit/delete cars
3. **Booking**: As user, book a car
4. **Data Persistence**: Refresh the page - data persists!

## 📊 Prisma Studio

To view and manage your database with a GUI:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your data.

## 🔧 Troubleshooting

### Database Connection Issues
1. Make sure Prisma dev server is running: `npx prisma dev`
2. Check your `DATABASE_URL` in `.env`
3. Try: `npm run db:push` to sync schema

### Build Errors
1. Regenerate Prisma client: `npm run db:generate`
2. Clear Next.js cache: `rm -rf .next`
3. Restart dev server: `npm run dev`

---

🎉 **Your car rental app is now a full-stack application!** The frontend seamlessly connects to a real database with proper authentication and API endpoints.
