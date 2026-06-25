#!/bin/bash

# DailyFlow Setup Script

echo "🚀 DailyFlow Setup Starting..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/dailyflow
JWT_SECRET=your-jwt-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
EOF
fi

cd ..
echo "✅ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
fi

cd ..
echo "✅ Frontend setup complete"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running on localhost:27017"
echo "2. In one terminal, run: cd backend && npm run dev"
echo "3. In another terminal, run: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Don't forget to update .env files with your actual values!"
