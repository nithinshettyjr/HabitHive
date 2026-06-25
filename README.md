# HabitHive - Smart Habit & Life Tracking Platform

A comprehensive web application designed to help users build habits, track daily activities, monitor personal growth, and improve productivity through powerful analytics and intuitive tracking systems.

## Features

### 1. **Smart Habit Tracking**
- Create, edit, and delete habits (up to 99)
- Categorize habits (Health, Fitness, Learning, Productivity, Finance, Mindfulness, Custom)
- Interactive monthly habit grid
- Streak tracking with visualizations
- Monthly target setting for every habit

### 2. **Dynamic Calendar Engine**
- Monthly, weekly, and daily views
- Auto-generate calendar layouts
- Leap year support
- Date calculations and automatic updates

### 3. **Analytics Dashboard**
- Daily completion rates
- Weekly and monthly progress tracking
- Beautiful charts and visualizations
- Habit streak analytics
- Monthly heatmap calendar
- Top performing habits display

### 4. **Daily Journal & Reflection**
- Rich text editor for journal entries
- Mood tracking (😊, 🙏, 😴, 🤔, 😢, 😡, 🥳)
- Search past entries
- Tags and organization

### 5. **Achievement System**
- Gamified experience with milestone badges
- Habit streak rewards
- Monthly challenges
- Achievement timeline

### 6. **Printable PDF Tracker**
- Generate monthly habit checklists
- Daily protocol trackers
- Mood tracking graphs
- Screen time trackers
- Downloadable templates

### 7. **User Authentication**
- Secure sign-up and login
- Google OAuth integration
- Password reset functionality
- JWT-based authentication

### 8. **Mobile Responsive Design**
- Fully responsive for all devices
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Fast loading and smooth navigation

### 9. **Quantified Self Tracking**
- Health metrics (water intake, sleep hours, exercise duration, weight)
- Digital wellbeing tracking (screen time, social media, focus hours)
- Personal metrics (energy level, mood score, stress level, productivity)

## Tech Stack

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Radix UI
- **Charts**: Recharts
- **Icons**: React Icons
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT + NextAuth.js
- **Middleware**: CORS, Helmet, Morgan

### Deployment
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

## Project Structure

```
Dailyroutine/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   ├── habits/
│   │   ├── analytics/
│   │   ├── achievements/
│   │   ├── journal/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Charts.tsx
│   │   ├── HabitGrid.tsx
│   │   ├── Achievements.tsx
│   │   └── ...
│   ├── lib/
│   ├── hooks/
│   ├── store/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local
│
└── backend/
    ├── src/
    │   ├── models/
    │   │   ├── User.ts
    │   │   ├── Habit.ts
    │   │   ├── JournalEntry.ts
    │   │   └── Achievement.ts
    │   ├── controllers/
    │   │   ├── authController.ts
    │   │   ├── habitController.ts
    │   │   ├── journalController.ts
    │   │   └── achievementController.ts
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── habits.ts
    │   │   ├── journal.ts
    │   │   └── achievements.ts
    │   ├── middleware/
    │   │   └── auth.ts
    │   ├── utils/
    │   │   └── jwt.ts
    │   └── server.ts
    ├── package.json
    ├── tsconfig.json
    └── .env
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run at `http://localhost:5000`

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/habithive
JWT_SECRET=your-jwt-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/google-signin` - Google OAuth login

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/complete` - Mark habit as completed
- `GET /api/habits/analytics` - Get habit analytics

### Journal
- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Create new entry
- `GET /api/journal/:id` - Get specific entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Achievements
- `GET /api/achievements` - Get all achievements
- `POST /api/achievements` - Unlock new achievement

## Design System

### Colors
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #22C55E (Green)
- **Accent**: #F59E0B (Amber)
- **Background**: White / Dark Gray

### Typography
- **Heading**: Poppins
- **Body**: Inter

### Effects
- Glassmorphism design
- Smooth transitions and animations
- Dark and Light mode support

## Features Roadmap

- [ ] Advanced analytics with machine learning predictions
- [ ] Social features (share achievements, buddy system)
- [ ] Mobile app (React Native)
- [ ] Habit templates library
- [ ] Integration with fitness trackers
- [ ] Email reminders and notifications
- [ ] Team/family habit tracking
- [ ] Advanced PDF customization

## Unique Selling Points

1. **Comprehensive Tracking** - All-in-one platform for habits, journal, analytics
2. **Beautiful Design** - Modern glassmorphism with smooth animations
3. **Printable Templates** - Download and print your trackers
4. **Analytics Driven** - Visual progress tracking with deep insights
5. **Gamification** - Achievement system keeps users motivated
6. **Mobile First** - Fully responsive and PWA-ready
7. **Privacy Focused** - Data stays with MongoDB, secure JWT auth

## Getting Started

1. Clone the repository
2. Set up MongoDB locally or use MongoDB Atlas
3. Install frontend dependencies: `cd frontend && npm install`
4. Install backend dependencies: `cd backend && npm install`
5. Configure environment variables
6. Start backend: `npm run dev` in backend folder
7. Start frontend: `npm run dev` in frontend folder
8. Open `http://localhost:3000` in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

**Transform your daily actions into lifelong success with HabitHive!** ✨
