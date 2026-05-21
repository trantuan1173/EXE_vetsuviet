#!/bin/bash

# Test Script - Vết Sử Việt
# Kiểm tra xem backend và frontend có chạy được không

echo "🎌 Vết Sử Việt - Test Script"
echo "================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB CLI không tìm thấy (có thể dùng MongoDB Atlas)"
else
    echo "✅ MongoDB CLI found"
fi
echo ""

# Check Backend files
echo "🔍 Checking Backend files..."
if [ ! -f "backend/package.json" ]; then
    echo "❌ backend/package.json không tồn tại"
    exit 1
fi
if [ ! -f "backend/server.js" ]; then
    echo "❌ backend/server.js không tồn tại"
    exit 1
fi
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env chưa tạo - copy từ .env.example"
    cp backend/.env.example backend/.env
    echo "✅ Đã tạo backend/.env"
fi
echo "✅ Backend files OK"
echo ""

# Check Frontend files
echo "🔍 Checking Frontend files..."
if [ ! -f "frontend/package.json" ]; then
    echo "❌ frontend/package.json không tồn tại"
    exit 1
fi
if [ ! -f "frontend/index.html" ]; then
    echo "❌ frontend/index.html không tồn tại"
    exit 1
fi
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env chưa tạo"
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
    echo "✅ Đã tạo frontend/.env"
fi
echo "✅ Frontend files OK"
echo ""

# Check Backend dependencies
echo "📦 Checking Backend dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies chưa cài - chạy: cd backend && npm install"
else
    echo "✅ Backend dependencies OK"
fi
echo ""

# Check Frontend dependencies
echo "📦 Checking Frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies chưa cài - chạy: cd frontend && npm install"
else
    echo "✅ Frontend dependencies OK"
fi
echo ""

echo "================================"
echo "✅ Kiểm tra hoàn tất!"
echo ""
echo "📝 Bước tiếp theo:"
echo "1. Đảm bảo MongoDB đang chạy"
echo "2. Terminal 1: cd backend && npm run dev"
echo "3. Terminal 2: cd frontend && npm run dev"
echo "4. Mở browser: http://localhost:3000"
echo ""
echo "📖 Xem thêm: QUICKSTART.md"
