const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const quizController = require('../controllers/quizController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

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

// Chapter management
router.post('/chapters', courseController.createChapter);
router.put('/chapters/:id', courseController.updateChapter);
router.delete('/chapters/:id', courseController.deleteChapter);

// Lesson management
router.post('/lessons', courseController.createLesson);
router.put('/lessons/:id', courseController.updateLesson);
router.delete('/lessons/:id', courseController.deleteLesson);

// Quiz management
router.get('/quizzes', quizController.getAllQuizzes);
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.delete('/quizzes/:id', quizController.deleteQuiz);

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

// Order management
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
