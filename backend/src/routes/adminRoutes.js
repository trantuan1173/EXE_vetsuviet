const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const quizController = require('../controllers/quizController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Multer config for Excel file upload (in-memory)
const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
    }
  },
});

// All admin routes require auth + admin role
router.use(authMiddleware, adminOnly);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);

// Course management (Admin CRUD)
router.get('/courses', courseController.getAllCoursesAdmin);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);
router.post('/courses/:id/video/init', courseController.initCourseVideoUpload);
router.post('/courses/:id/video/complete', courseController.completeCourseVideoUpload);
router.post('/courses/video/sign-part', courseController.signCourseVideoPart);
router.post('/courses/video/abort', courseController.abortCourseVideoUpload);
router.delete('/courses/:id/video', courseController.deleteCourseVideo);
router.post('/courses/:id/cover/init', courseController.initCourseCoverUpload);
router.post('/courses/:id/cover/complete', courseController.completeCourseCoverUpload);
router.post('/courses/cover/abort', courseController.abortCourseCoverUpload);
router.delete('/courses/:id/cover', courseController.deleteCourseCover);

// Chapter management
router.post('/chapters', courseController.createChapter);
router.put('/chapters/:id', courseController.updateChapter);
router.delete('/chapters/:id', courseController.deleteChapter);

// Lesson management
router.post('/lessons', courseController.createLesson);
router.put('/lessons/:id', courseController.updateLesson);
router.delete('/lessons/:id', courseController.deleteLesson);

// Quiz management
router.get('/quizzes/template', quizController.downloadTemplate);
router.get('/quizzes', quizController.getAllQuizzes);
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.delete('/quizzes/:id', quizController.deleteQuiz);
router.post('/quizzes/:quizId/import', excelUpload.single('file'), quizController.importQuestions);

// Question management
router.get('/quizzes/:quizId/questions', quizController.getQuestionsByQuiz);
router.post('/questions', quizController.createQuestion);
router.put('/questions/:id', quizController.updateQuestion);
router.delete('/questions/:id', quizController.deleteQuestion);

// Product management
router.get('/products', productController.getAllProductsAdmin);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.post('/products/:id/image/init', productController.initProductImageUpload);
router.post('/products/image/sign-part', productController.signProductImagePart);
router.post('/products/:id/image/complete', productController.completeProductImageUpload);
router.post('/products/image/abort', productController.abortProductImageUpload);
router.delete('/products/:id/image', productController.deleteProductImage);

// Order management
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
