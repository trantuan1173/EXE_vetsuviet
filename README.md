# 🎌 Vết Sử Việt - Hệ thống Học tập Lịch sử Việt Nam

Nền tảng học tập lịch sử Việt Nam qua quiz tương tác, gamification (XP/Level) và cửa hàng vật phẩm lịch sử.

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Validation**: express-validator
- **Security**: bcryptjs, CORS

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API

---

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js >= 16.x
- MongoDB >= 5.x (chạy local hoặc MongoDB Atlas)

### 1. Clone Repository
```bash
git clone <repository-url>
cd EXE_vetsuviet
```

### 2. Setup Backend
```bash
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin MongoDB của bạn
# MONGO_URI=mongodb://localhost:27017/vetsuviet
# JWT_SECRET=your_secret_key_here

# Chạy server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

### 3. Setup Frontend
```bash
cd frontend
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

---

## 📁 Cấu trúc Dự án

```
EXE_vetsuviet/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database, JWT config
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # Context providers
    │   ├── hooks/          # Custom hooks
    │   ├── services/       # API services
    │   └── utils/          # Helper functions
    ├── index.html
    └── package.json
```

---

## 🎯 Tính năng Chính

### 👤 User Features
- ✅ Đăng ký / Đăng nhập / Quản lý hồ sơ
- ✅ Xem danh sách khóa học (filter theo triều đại, độ khó)
- ✅ Ghi danh khóa học
- ✅ Xem bài học (video player)
- ✅ Làm quiz tương tác với timer
- ✅ Kiếm XP và Level up
- ✅ Mua sản phẩm lịch sử
- ✅ Giỏ hàng và thanh toán
- ✅ Xem lịch sử quiz và XP

### 🔐 Admin Features
- ✅ Dashboard thống kê
- ✅ Quản lý khóa học, chương, bài học
- ✅ Quản lý quiz và câu hỏi
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng

---

## 🗄️ Database Schema

### Collections
- **users** - Người dùng (User/Admin)
- **courses** - Khóa học
- **chapters** - Chương học
- **lessons** - Bài học
- **quizzes** - Bài quiz
- **quizquestions** - Câu hỏi quiz
- **quizhistories** - Lịch sử làm quiz
- **products** - Sản phẩm
- **orders** - Đơn hàng
- **enrollments** - Ghi danh khóa học
- **rewardtransactions** - Lịch sử XP

---

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile (Auth required)

### Courses
- `GET /api/courses` - Danh sách khóa học
- `GET /api/courses/:id` - Chi tiết khóa học
- `POST /api/courses/:id/enroll` - Ghi danh (Auth required)

### Quiz
- `GET /api/quiz/lesson/:lessonId` - Lấy quiz theo bài học
- `POST /api/quiz/submit` - Nộp bài quiz (Auth required)

### Shop
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/orders` - Tạo đơn hàng (Auth required)

### Admin (Auth + Admin role required)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/courses` - Quản lý khóa học
- `GET /api/admin/users` - Quản lý users
- ... (xem backend/README.md để biết đầy đủ)

---

## 🎮 Gamification

- User nhận **XP** khi hoàn thành quiz đạt điểm
- **Level** tự động tính: `level = floor(xp / 100) + 1`
- Mỗi 100 XP = 1 Level
- XP được log trong `rewardtransactions`

---

## 🧪 Test Account

Sau khi chạy server, bạn có thể tạo tài khoản admin thủ công:

```bash
# Kết nối MongoDB và tạo user admin
mongosh vetsuviet
db.users.insertOne({
  email: "admin@vetsuviet.com",
  password: "$2a$10$...", // hash của "admin123"
  fullName: "Admin",
  role: "admin",
  xp: 0,
  level: 1,
  isActive: true
})
```

Hoặc đăng ký qua UI và update role trong MongoDB.

---

## 📝 TODO / Roadmap

- [ ] Upload ảnh (Cloudinary/AWS S3)
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**TuanTA** - EXE Project 2026

---

## 🙏 Acknowledgments

- Lịch sử Việt Nam
- MERN Stack Community
- Tailwind CSS
- React Router
