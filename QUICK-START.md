# 🚀 Quick Start - Backend Connected!

## Your app is now connected to a real database! Here's how to get started:

### 1. Start Database (Required)
```bash
npx prisma dev
```
*Keep this terminal open - your database needs to stay running*

### 2. Setup Database (One-time)
```bash
npm run db:push
npm run migrate-data
```

### 3. Start Your App
```bash
npm run dev
```

## 🎉 That's it! Your features now work with real persistence:

- ✅ **User Registration/Login** → Real authentication
- ✅ **Car Management** → Database storage
- ✅ **Bookings** → Persistent across sessions
- ✅ **Admin Features** → Role-based access control

## 🔑 Test Accounts Created:

**Admin:** admin@muj.manipal.edu / admin123
**Student:** student@muj.manipal.edu / user123

## 🆘 Need Help?

**Database won't start?**
- Make sure ports 51213-51215 are free
- Restart: `npx prisma dev`

**API errors?**
- Check if database is running
- Try: `npm run db:generate`

**Everything else:** See `README-BACKEND.md` for full documentation

---
💡 **Your localStorage data is preserved** - the app will continue working even if the database isn't connected yet!
