# DailyFlow - Complete File Listing

## 📋 Project Structure

### Root Directory Files
- `README.md` - Complete project documentation
- `SETUP.md` - Setup and installation guide
- `DEPLOYMENT.md` - Production deployment guide
- `PROJECT_SUMMARY.md` - Project overview and summary
- `QUICK_REFERENCE.md` - Quick reference guide
- `docker-compose.yml` - Docker orchestration file
- `setup.bat` - Windows setup script
- `setup.sh` - Unix/Mac setup script

---

## Frontend Directory Structure

### `/frontend/` - Next.js Application

#### Config Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.env.local` - Environment variables (local)
- `Dockerfile` - Docker container configuration

#### App Directory (`/app/`)
- `layout.tsx` - Root layout wrapper
- `page.tsx` - Home/landing page
- `globals.css` - Global styles
- `providers.tsx` - Auth provider setup

#### Authentication Routes (`/app/auth/`)
- `signin/page.tsx` - Sign in page
- `signup/page.tsx` - Sign up page
- `api/auth/[...nextauth]/route.ts` - NextAuth API handler

#### Dashboard Pages (`/app/`)
- `dashboard/page.tsx` - Main dashboard
- `habits/page.tsx` - Habit tracking page
- `analytics/page.tsx` - Analytics dashboard
- `achievements/page.tsx` - Achievements page
- `journal/page.tsx` - Journal entries page

#### Components (`/components/`)
- `Navbar.tsx` - Navigation component
- `Charts.tsx` - Chart components (Bar, Line, Pie)
- `HabitGrid.tsx` - Monthly habit tracker grid
- `Achievements.tsx` - Achievement cards
- `CreateHabitModal.tsx` - Modal for creating habits

#### Library/Utils (`/lib/`)
- `api.ts` - API client with Axios
- `pdfGenerator.ts` - PDF export utilities
- `utils.ts` - Helper functions
  - `calculateStreak()` - Streak calculation
  - `getCompletionPercentage()` - Progress calc
  - `formatDate()` - Date formatting
  - `getDaysInMonth()` - Calendar helper
  - `calculateAverageCompletion()` - Average calc
  - `getTopHabits()` - Top habits sorting

#### Store (`/store/`)
- `index.ts` - Zustand state management
  - `useHabitStore` - Habit store
  - `useUserStore` - User store

#### Public Assets (`/public/`)
- (Empty - add logos, images here)

---

## Backend Directory Structure

### `/backend/` - Express.js API Server

#### Config Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables
- `Dockerfile` - Docker configuration

#### Server (`/src/`)
- `server.ts` - Main server entry point
  - Express app setup
  - MongoDB connection
  - Route mounting
  - Error handling

#### Models (`/src/models/`)
- `User.ts` - User schema
  ```
  - name: string
  - email: string (unique)
  - password: string (optional, hashed)
  - googleId: string (optional)
  - timestamps
  ```

- `Habit.ts` - Habit schema
  ```
  - userId: ObjectId (ref)
  - name: string
  - category: enum
  - description: string
  - color: string
  - targetPerMonth: number
  - streak: number
  - completedDates: Date[]
  - timestamps
  ```

- `JournalEntry.ts` - Journal schema
  ```
  - userId: ObjectId (ref)
  - title: string
  - content: string
  - mood: enum (emoji)
  - date: Date
  - tags: string[]
  - timestamps
  ```

- `Achievement.ts` - Achievement schema
  ```
  - userId: ObjectId (ref)
  - title: string
  - description: string
  - icon: string
  - unlockedAt: Date
  - timestamps
  ```

#### Controllers (`/src/controllers/`)
- `authController.ts` - Authentication logic
  - `signup()` - Register new user
  - `login()` - User login
  - `googleSignIn()` - Google OAuth

- `habitController.ts` - Habit management
  - `createHabit()` - Create new habit
  - `getHabits()` - Get all habits
  - `getHabit()` - Get single habit
  - `updateHabit()` - Update habit
  - `deleteHabit()` - Delete habit
  - `completeHabit()` - Mark complete
  - `getHabitAnalytics()` - Get analytics

- `journalController.ts` - Journal management
  - `createEntry()` - Create entry
  - `getEntries()` - Get all entries
  - `getEntry()` - Get single entry
  - `updateEntry()` - Update entry
  - `deleteEntry()` - Delete entry

- `achievementController.ts` - Achievement logic
  - `getAchievements()` - Get all achievements
  - `unlockAchievement()` - Unlock new

#### Routes (`/src/routes/`)
- `auth.ts` - Auth endpoints
  ```
  POST /auth/signup
  POST /auth/login
  POST /auth/google-signin
  ```

- `habits.ts` - Habit endpoints
  ```
  GET /habits
  POST /habits
  GET /habits/:id
  PUT /habits/:id
  DELETE /habits/:id
  POST /habits/:id/complete
  GET /habits/analytics
  ```

- `journal.ts` - Journal endpoints
  ```
  GET /journal
  POST /journal
  GET /journal/:id
  PUT /journal/:id
  DELETE /journal/:id
  ```

- `achievements.ts` - Achievement endpoints
  ```
  GET /achievements
  POST /achievements
  ```

#### Middleware (`/src/middleware/`)
- `auth.ts` - JWT authentication middleware
  - `authMiddleware()` - Verify JWT token
  - `AuthRequest` interface

#### Utilities (`/src/utils/`)
- `jwt.ts` - JWT utilities
  - `generateToken()` - Create JWT
  - `verifyToken()` - Verify JWT

---

## 📊 Statistics

### Frontend
- **Total Components**: 5+ components
- **Total Pages**: 6 pages (home, signin, signup, dashboard, habits, analytics, achievements, journal)
- **Lines of Code**: ~2000+ LOC
- **Dependencies**: 20+ packages

### Backend
- **Total Controllers**: 4 controllers
- **Total Routes**: 20+ endpoints
- **Total Models**: 4 models
- **Lines of Code**: ~800+ LOC
- **Dependencies**: 15+ packages

### Documentation
- **README.md**: Comprehensive guide
- **SETUP.md**: Installation instructions
- **DEPLOYMENT.md**: Production guide
- **PROJECT_SUMMARY.md**: Project overview
- **QUICK_REFERENCE.md**: Quick commands

---

## 🔄 Data Flow

### Authentication Flow
```
1. User registers/logs in
2. Backend validates credentials
3. Generate JWT token
4. NextAuth stores session
5. Token sent with API requests
6. Middleware verifies token
```

### Habit Tracking Flow
```
1. User creates habit
2. Backend stores in MongoDB
3. Daily mark completion
4. Backend updates completedDates
5. Frontend calculates streak
6. Analytics updated
```

### Analytics Flow
```
1. Frontend fetches habits
2. Calculate metrics (streak, completion, etc)
3. Render charts with Recharts
4. Display in analytics page
```

---

## 🔑 Key Features by File

| Feature | File Location |
|---------|---------------|
| Authentication | `/app/auth/` + `authController.ts` |
| Habit Tracking | `HabitGrid.tsx` + `habitController.ts` |
| Analytics | `Charts.tsx` + `analytics/page.tsx` |
| Journal | `journal/page.tsx` + `journalController.ts` |
| Achievements | `Achievements.tsx` + `achievementController.ts` |
| PDF Export | `pdfGenerator.ts` |
| State Management | `store/index.ts` |
| API Communication | `lib/api.ts` |
| Styling | `globals.css` + Tailwind |

---

## 📦 Dependencies Overview

### Frontend Key Dependencies
- `next` - React framework
- `react` - UI library
- `next-auth` - Authentication
- `axios` - HTTP client
- `recharts` - Charts
- `react-icons` - Icons
- `jspdf` + `html2canvas` - PDF generation
- `zustand` - State management
- `tailwindcss` - Styling
- `typescript` - Type safety

### Backend Key Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `cors` - CORS handling
- `helmet` - Security headers
- `morgan` - HTTP logging
- `dotenv` - Environment variables
- `typescript` - Type safety

---

## 🎯 Next Steps to Customize

1. **Replace branding**: Update logo in navbar
2. **Change colors**: Modify `tailwind.config.js`
3. **Add more categories**: Update habit model
4. **Implement notifications**: Add email/push
5. **Add social features**: Share achievements
6. **Mobile app**: React Native version
7. **AI insights**: Habit recommendations
8. **Integrations**: Fitness trackers, calendars

---

## 📝 Notes

- All files are TypeScript (.ts, .tsx)
- Frontend uses modern Next.js App Router
- Backend follows MVC pattern
- MongoDB collections are auto-created
- No migrations needed for development
- Environment variables are required
- Docker setup includes MongoDB service

---

**Total Project Size**: ~50 files, ~4000+ lines of code (excluding node_modules)

**Ready to deploy and customize! 🚀**
