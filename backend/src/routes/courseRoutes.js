const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', courseController.getCourses);
router.get('/enrolled', authMiddleware, courseController.getEnrolledCourses);
router.get('/:id', courseController.getCourseDetail);

// Protected: Enrollment
router.post('/:id/enroll', authMiddleware, courseController.enrollCourse);

// Protected: Mark lesson complete
router.post(
  '/:courseId/lessons/:lessonId/complete',
  authMiddleware,
  courseController.completeLesson
);

module.exports = router;
