#!/bin/bash

echo "🚀 Setting up Fyntrak for GitHub..."

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Fyntrak Trading Platform

✨ Features:
- Real-time Indian stock trading with virtual money
- Interactive charts and portfolio management
- Modern React frontend with Tailwind CSS
- Node.js backend with Express and Prisma
- MySQL database with proper schema
- Yahoo Finance API integration

🛠 Tech Stack:
- Frontend: React + Vite + Tailwind CSS + Recharts
- Backend: Node.js + Express + Prisma + MySQL
- API: Yahoo Finance v3 for real-time data

🚀 Ready for deployment!"

echo "✅ Git setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add remote origin:"
echo "   git remote add origin https://github.com/yourusername/fyntrak.git"
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎯 Your Fyntrak trading platform is ready for GitHub!"