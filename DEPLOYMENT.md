# DailyFlow - Deployment Guide

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

#### Step 1: Prepare Your Code
```bash
# Ensure all dependencies are installed
cd frontend
npm install

# Build the project
npm run build

# Test the build locally
npm start
```

#### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option B: Using GitHub**
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Set environment variables
6. Click "Deploy"

#### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend Deployment (Render or Railway)

#### Option 1: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: dailyflow-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=10000
```
6. Click "Create Web Service"

#### Option 2: Deploy to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create new project → GitHub repo
3. Configure environment variables
4. Deploy

### Database Deployment (MongoDB Atlas)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and login

#### Step 2: Create Cluster
1. Click "Build a Cluster"
2. Select "M0 Free" tier
3. Choose region close to your users
4. Click "Create Cluster"

#### Step 3: Get Connection String
1. Click "Connect"
2. Add current IP to IP Whitelist
3. Create database user
4. Get connection string
5. Replace `<username>` and `<password>` with your credentials

#### Step 4: Update Backend
In production .env:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dailyflow?retryWrites=true&w=majority
```

### Environment Setup

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret
```

#### Backend (.env.production)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dailyflow
JWT_SECRET=your-production-jwt-secret-key
PORT=10000
NODE_ENV=production
```

## 🔐 Security Checklist

- [ ] Generate strong random secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`
- [ ] Use HTTPS for all connections
- [ ] Enable MongoDB IP Whitelist
- [ ] Set CORS properly for your domain
- [ ] Enable rate limiting on API
- [ ] Implement request validation
- [ ] Use strong passwords for MongoDB
- [ ] Enable 2FA on hosting platforms
- [ ] Set up SSL/TLS certificates
- [ ] Regular security audits

## 📊 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --profile

# Enable compression
npm install -D compression

# Implement image optimization
# Already done with Next.js Image component
```

### Backend
```bash
# Use connection pooling for MongoDB
# Already configured in mongoose

# Enable caching headers
# Configure in middleware

# Use CDN for static assets
# Configure in Vercel
```

## 📈 Monitoring & Analytics

### Frontend Monitoring (Vercel)
- Vercel automatically tracks Core Web Vitals
- Set up error tracking with Sentry
- Monitor performance in Vercel Dashboard

### Backend Monitoring
```bash
# Install Sentry for error tracking
npm install @sentry/node
```

```typescript
// backend/src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring
- MongoDB Atlas provides built-in monitoring
- Set up alerts in Atlas Dashboard
- Monitor query performance

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Build Backend
        run: cd backend && npm install && npm run build
      
      - name: Build Frontend
        run: cd frontend && npm install && npm run build
      
      - name: Deploy
        run: |
          # Your deployment commands here
```

## 🐛 Troubleshooting Production Issues

### Backend Won't Start
```bash
# Check logs
vercel logs --tail  # Render/Railway

# Verify environment variables
# Check .env files

# Test local build
npm run build
npm start
```

### Database Connection Issues
```bash
# Verify MongoDB URI
# Test connection string locally

# Check IP Whitelist in MongoDB Atlas
# Ensure credentials are correct
```

### Frontend 404 Errors
```bash
# Rebuild and redeploy
vercel --prod

# Clear Vercel cache
# Go to Settings → Deployment → Redeploy
```

## 📅 Maintenance Schedule

- **Weekly**: Review logs and monitor uptime
- **Monthly**: Security updates and dependency updates
- **Quarterly**: Full system audit and optimization
- **Annually**: Infrastructure review

## 💰 Cost Estimation

### Vercel
- Free tier: 100 GB bandwidth/month
- Pro: $20/month

### Render (Backend)
- Free tier: 750 hours/month
- Paid: $7/month (starter)

### MongoDB Atlas
- Free tier: 512 MB storage
- Shared: $0 (free)
- Dedicated: $57/month

## 🎯 Post-Deployment

1. ✅ Test all features in production
2. ✅ Set up monitoring and alerts
3. ✅ Create backup strategy
4. ✅ Document runbook for issues
5. ✅ Set up status page (optional)
6. ✅ Plan scaling strategy

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Your DailyFlow app is now ready for the world! 🌍**
