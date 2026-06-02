const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', courseController.getCourses);
router.get('/random', courseController.getRandomCourses);
router.get('/enrolled', authMiddleware, courseController.getEnrolledCourses);
router.get('/:id', courseController.getCourseDetail);
router.get('/:id/video/playback', authMiddleware, courseController.getCourseVideoPlayback);

// Protected: Enrollment
router.post('/:id/enroll', authMiddleware, courseController.enrollCourse);

// Protected: Mark course complete
router.post('/:courseId/complete', authMiddleware, courseController.completeCourse);

module.exports = router;
