const courseService = require('../services/courseService');
const { sendResponse } = require('../utils/response');

const courseController = {
  // GET /api/courses
  getCourses: async (req, res, next) => {
    try {
      const { page, limit, dynasty, difficulty, search } = req.query;
      const result = await courseService.getCourses({ page, limit, dynasty, difficulty, search });
      sendResponse(res, 200, true, 'Courses retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/courses/:id
  getCourseDetail: async (req, res, next) => {
    try {
      const result = await courseService.getCourseDetail(req.params.id);
      sendResponse(res, 200, true, 'Course detail retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/courses/:id/enroll
  enrollCourse: async (req, res, next) => {
    try {
      const enrollment = await courseService.enrollCourse(req.user.id, req.params.id);
      sendResponse(res, 201, true, 'Enrolled successfully', enrollment);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/courses/enrolled
  getEnrolledCourses: async (req, res, next) => {
    try {
      const enrollments = await courseService.getUserEnrollments(req.user.id);
      sendResponse(res, 200, true, 'Enrolled courses retrieved', enrollments);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/courses/:courseId/lessons/:lessonId/complete
  completeLesson: async (req, res, next) => {
    try {
      const enrollment = await courseService.completeLesson(
        req.user.id,
        req.params.courseId,
        req.params.lessonId
      );
      sendResponse(res, 200, true, 'Lesson marked as completed', enrollment);
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN ----
  // POST /api/admin/courses
  createCourse: async (req, res, next) => {
    try {
      const course = await courseService.createCourse(req.body);
      sendResponse(res, 201, true, 'Course created', course);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/courses/:id
  updateCourse: async (req, res, next) => {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      sendResponse(res, 200, true, 'Course updated', course);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/courses/:id
  deleteCourse: async (req, res, next) => {
    try {
      await courseService.deleteCourse(req.params.id);
      sendResponse(res, 200, true, 'Course deleted');
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN: CHAPTER ----
  // POST /api/admin/chapters
  createChapter: async (req, res, next) => {
    try {
      const chapter = await courseService.createChapter(req.body);
      sendResponse(res, 201, true, 'Chapter created', chapter);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/chapters/:id
  updateChapter: async (req, res, next) => {
    try {
      const chapter = await courseService.updateChapter(req.params.id, req.body);
      sendResponse(res, 200, true, 'Chapter updated', chapter);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/chapters/:id
  deleteChapter: async (req, res, next) => {
    try {
      await courseService.deleteChapter(req.params.id);
      sendResponse(res, 200, true, 'Chapter deleted');
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN: LESSON ----
  // POST /api/admin/lessons
  createLesson: async (req, res, next) => {
    try {
      const lesson = await courseService.createLesson(req.body);
      sendResponse(res, 201, true, 'Lesson created', lesson);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/lessons/:id
  updateLesson: async (req, res, next) => {
    try {
      const lesson = await courseService.updateLesson(req.params.id, req.body);
      sendResponse(res, 200, true, 'Lesson updated', lesson);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/lessons/:id
  deleteLesson: async (req, res, next) => {
    try {
      await courseService.deleteLesson(req.params.id);
      sendResponse(res, 200, true, 'Lesson deleted');
    } catch (error) {
      next(error);
    }
  },

  // ADMIN: Get all courses (with unpublished)
  getAllCoursesAdmin: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await courseService.getAllCoursesAdmin({ page, limit });
      sendResponse(res, 200, true, 'All courses retrieved', result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = courseController;
