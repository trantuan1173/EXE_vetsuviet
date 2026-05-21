# Vết Sử Việt - Backend API

Backend cho hệ thống học tập lịch sử Việt Nam với quiz tương tác và cửa hàng vật phẩm.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Cài đặt

```bash
cd backend
npm install
```

## Cấu hình

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vetsuviet
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Chạy Server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:6000` (theo cấu hình `.env` hiện tại)

## Swagger API Documentation (Interactive)

Sau khi chạy backend, mở:

- Swagger UI: `http://localhost:6000/api/docs`
- OpenAPI JSON: `http://localhost:6000/api/docs.json`

### Cách test API trực tiếp trên Swagger

1. Gọi `POST /api/auth/login` hoặc `POST /api/auth/register` để lấy `token`.
2. Nhấn nút **Authorize** trên Swagger UI.
3. Nhập: `Bearer <token>`
4. Test các API cần auth như `/api/users/profile`, `/api/orders`, `/api/admin/dashboard`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy profile (Auth required)
- `PUT /api/auth/profile` - Cập nhật profile (Auth required)

### Courses
- `GET /api/courses` - Danh sách khóa học (có filter, search, pagination)
- `GET /api/courses/:id` - Chi tiết khóa học
- `POST /api/courses/:id/enroll` - Ghi danh khóa học (Auth required)
- `GET /api/courses/enrolled` - Khóa học đã ghi danh (Auth required)
- `POST /api/courses/:courseId/lessons/:lessonId/complete` - Hoàn thành bài học (Auth required)

### Lessons
- `GET /api/lessons/:id` - Chi tiết bài học
- `GET /api/lessons/chapter/:chapterId` - Danh sách bài học theo chương

### Quiz
- `GET /api/quiz/lesson/:lessonId` - Lấy quiz theo bài học (Auth required)
- `POST /api/quiz/submit` - Nộp bài quiz (Auth required)
- `GET /api/quiz/history` - Lịch sử làm quiz (Auth required)

### Products
- `GET /api/products` - Danh sách sản phẩm (có filter, search, pagination)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/categories` - Danh sách danh mục

### Orders
- `POST /api/orders` - Tạo đơn hàng (Auth required)
- `GET /api/orders` - Danh sách đơn hàng của user (Auth required)
- `GET /api/orders/:id` - Chi tiết đơn hàng (Auth required)
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng (Auth required)

### Users
- `GET /api/users/profile` - Profile user (Auth required)
- `PUT /api/users/profile` - Cập nhật profile (Auth required)
- `POST /api/users/change-password` - Đổi mật khẩu (Auth required)
- `GET /api/users/quiz-history` - Lịch sử quiz (Auth required)
- `GET /api/users/xp-history` - Lịch sử XP (Auth required)

### Search
- `GET /api/search?q=...&type=course|product` - Tìm kiếm toàn cục

### Admin (Auth + Admin role required)
- `GET /api/admin/dashboard` - Dashboard thống kê
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/users/:id` - Chi tiết user
- `PUT /api/admin/users/:id/toggle-status` - Khóa/mở tài khoản
- `GET /api/admin/courses` - Quản lý khóa học
- `POST /api/admin/courses` - Tạo khóa học
- `PUT /api/admin/courses/:id` - Cập nhật khóa học
- `DELETE /api/admin/courses/:id` - Xóa khóa học
- `POST /api/admin/chapters` - Tạo chương
- `PUT /api/admin/chapters/:id` - Cập nhật chương
- `DELETE /api/admin/chapters/:id` - Xóa chương
- `POST /api/admin/lessons` - Tạo bài học
- `PUT /api/admin/lessons/:id` - Cập nhật bài học
- `DELETE /api/admin/lessons/:id` - Xóa bài học
- `GET /api/admin/quizzes` - Quản lý quiz
- `POST /api/admin/quizzes` - Tạo quiz
- `PUT /api/admin/quizzes/:id` - Cập nhật quiz
- `DELETE /api/admin/quizzes/:id` - Xóa quiz
- `GET /api/admin/quizzes/:quizId/questions` - Danh sách câu hỏi
- `POST /api/admin/questions` - Tạo câu hỏi
- `PUT /api/admin/questions/:id` - Cập nhật câu hỏi
- `DELETE /api/admin/questions/:id` - Xóa câu hỏi
- `GET /api/admin/products` - Quản lý sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm
- `GET /api/admin/orders` - Quản lý đơn hàng
- `PUT /api/admin/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Cấu trúc Database

Xem chi tiết schemas tại `/src/models/`

### Collections:
- `users` - Người dùng (User/Admin)
- `courses` - Khóa học
- `chapters` - Chương học
- `lessons` - Bài học
- `quizzes` - Bài quiz
- `quizquestions` - Câu hỏi quiz
- `quizhistories` - Lịch sử làm quiz
- `products` - Sản phẩm
- `orders` - Đơn hàng
- `enrollments` - Ghi danh khóa học
- `rewardtransactions` - Lịch sử XP

## Gamification

- User nhận XP khi hoàn thành quiz đạt điểm
- Level tự động tính: `level = floor(xp / 100) + 1`
- XP được log trong `rewardtransactions`

## License

MIT
