# 🚀 Quick Start Guide

## Bước 1: Cài đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (terminal mới)
cd frontend
npm install
```

## Bước 2: Cấu hình MongoDB

Đảm bảo MongoDB đang chạy:

```bash
# Nếu cài local
mongod

# Hoặc dùng MongoDB Atlas (cloud)
# Cập nhật MONGO_URI trong backend/.env
```

## Bước 3: Chạy Backend

```bash
cd backend
npm run dev
```

✅ Backend chạy tại: **http://localhost:5000**

## Bước 4: Chạy Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend chạy tại: **http://localhost:3000**

## Bước 5: Tạo Admin Account

Mở MongoDB shell:

```bash
mongosh vetsuviet
```

Chạy lệnh:

```javascript
db.users.insertOne({
  email: "admin@vetsuviet.com",
  password: "$2a$10$YourHashedPasswordHere", // Hoặc đăng ký qua UI rồi update role
  fullName: "Admin",
  role: "admin",
  xp: 0,
  level: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Hoặc đơn giản hơn:**
1. Đăng ký tài khoản qua UI: http://localhost:3000/register
2. Vào MongoDB và update role:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Bước 6: Test API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","fullName":"Test User"}'
```

## 🎯 Các trang chính

- **Home**: http://localhost:3000/
- **Courses**: http://localhost:3000/courses
- **Shop**: http://localhost:3000/shop
- **Login**: http://localhost:3000/login
- **Admin**: http://localhost:3000/admin (cần role admin)

## ⚠️ Troubleshooting

### Backend không chạy
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra file `.env` đã tạo chưa
- Kiểm tra port 5000 có bị chiếm không

### Frontend không chạy
- Xóa `node_modules` và chạy lại `npm install`
- Kiểm tra port 3000 có bị chiếm không
- Kiểm tra backend đã chạy chưa

### CORS Error
- Đảm bảo backend đang chạy
- Kiểm tra `vite.config.js` proxy settings

## 📝 Sample Data

Để test nhanh, bạn có thể tạo sample data:

```javascript
// Tạo khóa học mẫu
db.courses.insertOne({
  title: "Lịch sử Nhà Lý",
  description: "Tìm hiểu về triều đại Lý",
  dynasty: "Lý",
  difficulty: "basic",
  enrolledCount: 0,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Tạo sản phẩm mẫu
db.products.insertOne({
  name: "Mô hình Tháp Rùa",
  description: "Mô hình thu nhỏ Tháp Rùa Hồ Gươm",
  category: "Mô hình",
  price: 150000,
  stock: 10,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

**Chúc bạn code vui vẻ! 🎉**
