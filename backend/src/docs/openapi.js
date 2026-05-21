/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check API
 *     responses:
 *       200:
 *         description: API is running
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 *   put:
 *     tags: [Auth]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get course list with filter/pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: dynasty
 *         schema: { type: string, example: 'Trần' }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [basic, intermediate, advanced] }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: 'Nhà Trần' }
 *     responses:
 *       200:
 *         description: Course list
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get course detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course detail
 */

/**
 * @swagger
 * /api/courses/{id}/enroll:
 *   post:
 *     tags: [Courses]
 *     summary: Enroll current user to course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Enrolled successfully
 */

/**
 * @swagger
 * /api/courses/enrolled:
 *   get:
 *     tags: [Courses]
 *     summary: Get enrolled courses of current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses
 */

/**
 * @swagger
 * /api/courses/{courseId}/lessons/{lessonId}/complete:
 *   post:
 *     tags: [Courses]
 *     summary: Mark lesson complete
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson completed
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     tags: [Lessons]
 *     summary: Get lesson detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson detail
 */

/**
 * @swagger
 * /api/lessons/chapter/{chapterId}:
 *   get:
 *     tags: [Lessons]
 *     summary: Get lessons by chapter
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson list
 */

/**
 * @swagger
 * /api/quiz/lesson/{lessonId}:
 *   get:
 *     tags: [Quiz]
 *     summary: Get quiz by lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Quiz detail
 */

/**
 * @swagger
 * /api/quiz/submit:
 *   post:
 *     tags: [Quiz]
 *     summary: Submit quiz answers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitQuizRequest'
 *     responses:
 *       200:
 *         description: Quiz result
 */

/**
 * @swagger
 * /api/quiz/history:
 *   get:
 *     tags: [Quiz]
 *     summary: Get current user quiz history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz history
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get product list
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string, example: 'Mô hình' }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: 'Tháp Rùa' }
 *     responses:
 *       200:
 *         description: Product list
 */

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     tags: [Products]
 *     summary: Get product categories
 *     responses:
 *       200:
 *         description: Category list
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product detail
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     tags: [Orders]
 *     summary: Get current user orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order detail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order detail
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     tags: [Orders]
 *     summary: Cancel order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order canceled
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile updated
 */

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed
 */

/**
 * @swagger
 * /api/users/quiz-history:
 *   get:
 *     tags: [Users]
 *     summary: Get user quiz history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz history
 */

/**
 * @swagger
 * /api/users/xp-history:
 *   get:
 *     tags: [Users]
 *     summary: Get user XP history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: XP history
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Global search for courses/products
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, example: 'Lý' }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [course, product] }
 *     responses:
 *       200:
 *         description: Search results
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get users list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user detail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User detail
 */

/**
 * @swagger
 * /api/admin/users/{id}/toggle-status:
 *   put:
 *     tags: [Admin]
 *     summary: Toggle user active status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User status updated
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     tags: [Admin]
 *     summary: Get all courses (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course list
 *   post:
 *     tags: [Admin]
 *     summary: Create course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreateRequest'
 *     responses:
 *       201:
 *         description: Course created
 */

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course deleted
 */

/**
 * @swagger
 * /api/admin/chapters:
 *   post:
 *     tags: [Admin]
 *     summary: Create chapter
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Chapter created
 */

/**
 * @swagger
 * /api/admin/chapters/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update chapter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chapter updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete chapter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chapter deleted
 */

/**
 * @swagger
 * /api/admin/lessons:
 *   post:
 *     tags: [Admin]
 *     summary: Create lesson
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lesson created
 */

/**
 * @swagger
 * /api/admin/lessons/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson deleted
 */

/**
 * @swagger
 * /api/admin/quizzes:
 *   get:
 *     tags: [Admin]
 *     summary: Get quizzes list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quizzes list
 *   post:
 *     tags: [Admin]
 *     summary: Create quiz
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Quiz created
 */

/**
 * @swagger
 * /api/admin/quizzes/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Quiz updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Quiz deleted
 */

/**
 * @swagger
 * /api/admin/quizzes/{quizId}/questions:
 *   get:
 *     tags: [Admin]
 *     summary: Get questions by quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Questions list
 */

/**
 * @swagger
 * /api/admin/questions:
 *   post:
 *     tags: [Admin]
 *     summary: Create question
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Question created
 */

/**
 * @swagger
 * /api/admin/questions/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Question updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Question deleted
 */

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: Get all products (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list
 *   post:
 *     tags: [Admin]
 *     summary: Create product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Get all orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
 */

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Update order status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order status updated
 */
