# DailyFlow - Quick Reference

## 🚀 Start Development (Windows)

```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev

# Open browser
http://localhost:3000
```

## 🚀 Start Development (Mac/Linux)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser
http://localhost:3000
```

## 🐳 Start with Docker

```bash
docker-compose up
# Opens on http://localhost:3000
```

## 📦 Installation

```bash
# Run setup script (auto-installs dependencies)
Windows:  .\setup.bat
Mac/Linux: ./setup.sh

# Or manual install
cd frontend && npm install
cd ../backend && npm install
```

## 🔧 Build for Production

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm start
```

## 📝 Available Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript check
```

### Backend
```bash
npm run dev         # Start development with ts-node
npm run build       # Build to dist folder
npm start          # Run production build
npm run lint       # Run ESLint
```

## 🔐 Environment Setup

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/dailyflow
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
```

## 🗄️ MongoDB Setup

### Local (Recommended)
```bash
# Windows: Download and install MongoDB Community
# Mac: brew install mongodb-community && brew services start mongodb-community
# Linux: sudo apt-get install mongodb && sudo systemctl start mongod

# Verify connection
mongosh  # or mongo
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster (Free tier)
3. Get connection string
4. Update MONGODB_URI in .env

## 🌐 API Testing

```bash
# Health Check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"test@example.com","password":"Pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'
```

## 📂 Project Structure

```
Dailyroutine/
├── frontend/           # Next.js React app
├── backend/            # Express.js API
├── docker-compose.yml  # Docker setup
├── setup.bat           # Windows setup
├── setup.sh            # Mac/Linux setup
├── README.md           # Full docs
├── SETUP.md            # Setup guide
└── DEPLOYMENT.md       # Deploy guide
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | Check mongod is running, verify URI |
| Port already in use | Change PORT in .env or use different port |
| npm install fails | Delete node_modules, run `npm cache clean --force` |
| Frontend won't load | Verify backend is running on 5000 |
| Google OAuth error | Update Client ID/Secret in .env.local |
| Build errors | Run `npm install` again, check TypeScript |

## 🎯 Common Tasks

### Create a Habit
1. Navigate to Habits page
2. Click "New Habit" button
3. Fill form (name, category, color, target)
4. Submit

### Mark Habit Complete
1. Go to Habits page
2. Click checkbox for the day
3. Check automatically updates streak

### View Analytics
1. Click Analytics in navbar
2. See charts and statistics
3. View top performing habits

### Write Journal Entry
1. Go to Journal page
2. Click "New Entry"
3. Add title, content, select mood
4. Save

### Check Achievements
1. Navigate to Achievements
2. See unlocked badges
3. Track progress on locked achievements

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive!

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```javascript
primary: "#YOUR-COLOR"
```

### Change Font
Edit `frontend/tailwind.config.js`:
```javascript
fontFamily: {
  poppins: ["Your Font"],
  inter: ["Your Font"]
}
```

### Add New Habit Category
1. Update `backend/src/models/Habit.ts` enum
2. Update `frontend/components/CreateHabitModal.tsx`
3. Restart servers

## 📊 File Sizes

- Frontend build: ~150KB gzipped
- Backend: ~50MB (with node_modules)
- Database: Minimal (depends on usage)

## 🔐 Security Notes

- Change all .env secrets in production
- Use HTTPS only in production
- Enable MongoDB IP whitelist
- Implement rate limiting
- Regular security audits

## 🚀 Deployment Links

- **Vercel Docs**: vercel.com/docs
- **Render Docs**: render.com/docs
- **MongoDB Atlas**: mongodb.com/cloud/atlas

## 💬 Support

For issues:
1. Check logs in terminal
2. Review browser console
3. Verify environment variables
4. Check main README.md

## ⏱️ Performance Tips

- Clear browser cache if seeing stale data
- Use DevTools Network tab to debug API calls
- Check MongoDB query performance
- Monitor API response times

## 📞 Useful Links

- Documentation: See README.md
- Setup Guide: See SETUP.md
- Deployment: See DEPLOYMENT.md
- API Docs: See backend/src/routes/

---

**Quick tip**: Keep this file open while developing! 📌
