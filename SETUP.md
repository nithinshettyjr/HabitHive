# DailyFlow - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

### Option 1: Manual Setup (Windows)

1. **Open PowerShell or Command Prompt** in the project root

2. **Run the setup script:**
   ```powershell
   .\setup.bat
   ```

3. **Start MongoDB** (if not already running):
   ```powershell
   mongod
   ```

4. **Start the Backend** (in a new terminal):
   ```powershell
   cd backend
   npm run dev
   ```

5. **Start the Frontend** (in another new terminal):
   ```powershell
   cd frontend
   npm run dev
   ```

6. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Option 2: Manual Setup (macOS/Linux)

1. **Open Terminal** in the project root

2. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start MongoDB** (if not already running):
   ```bash
   mongod
   ```

4. **Start the Backend** (in a new terminal):
   ```bash
   cd backend
   npm run dev
   ```

5. **Start the Frontend** (in another new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Option 3: Using Docker

1. **Install Docker and Docker Compose**

2. **Run Docker Compose:**
   ```bash
   docker-compose up
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 📋 Configuration

### Frontend Configuration (.env.local)

Create/update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend Configuration (.env)

Create/update `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/dailyflow
JWT_SECRET=your-jwt-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

## 🔐 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - http://localhost:3000
6. Copy Client ID and Client Secret to .env.local

## 🗄️ MongoDB Setup

### Local MongoDB (Recommended for Development)

**Windows:**
1. Download MongoDB Community Edition
2. Run the installer
3. MongoDB runs at `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create an account and cluster
3. Get the connection string
4. Update MONGODB_URI in backend/.env

## ✅ Verification

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Frontend Access
Open http://localhost:3000 and you should see the DailyFlow home page

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in backend/.env
- Verify port 27017 is not blocked

### Frontend Not Loading
- Clear browser cache
- Check if backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL in .env.local

### Port Already in Use
- Backend: Change PORT in .env to another port (e.g., 5001)
- Frontend: `npm run dev -- -p 3001`

### npm install Errors
- Delete node_modules folder
- Delete package-lock.json
- Run npm install again
- Clear npm cache: `npm cache clean --force`

## 📚 Project Structure

```
Dailyroutine/
├── frontend/          # Next.js React app
├── backend/           # Express.js API server
├── docker-compose.yml # Docker orchestration
├── setup.sh          # Linux/Mac setup script
├── setup.bat         # Windows setup script
└── README.md         # Full documentation
```

## 🚀 Development Commands

### Frontend
```bash
cd frontend

# Development
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

### Backend
```bash
cd backend

# Development
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## 📝 Notes

- Change `NEXTAUTH_SECRET` and `JWT_SECRET` to secure random strings in production
- Update Google OAuth credentials with your own
- For production, use environment-specific .env files
- Keep API URLs consistent between frontend and backend

## 🎯 Next Steps

1. ✅ Create your first habit
2. ✅ Complete a few daily habits
3. ✅ Check your analytics dashboard
4. ✅ Write a journal entry
5. ✅ Unlock achievements

## 🆘 Need Help?

- Check the [main README](./README.md) for full documentation
- Review backend logs in terminal
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

**Happy tracking! 🎉**
