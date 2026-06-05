const courseService = require('../services/courseService');
const { sendResponse } = require('../utils/response');

const courseController = {
  getCourses: async (req, res, next) => {
    try {
      const { page, limit, dynasty, difficulty, search } = req.query;
      const result = await courseService.getCourses({ page, limit, dynasty, difficulty, search });
      sendResponse(res, 200, true, 'Courses retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  getRandomCourses: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const result = await courseService.getRandomCourses({ limit });
      sendResponse(res, 200, true, 'Random courses retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  getCourseDetail: async (req, res, next) => {
    try {
      const result = await courseService.getCourseDetail(req.params.id);
      sendResponse(res, 200, true, 'Course detail retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  getCourseVideoPlayback: async (req, res, next) => {
    try {
      const result = await courseService.getCoursePlaybackUrl(req.params.id);
      sendResponse(res, 200, true, 'Playback URL generated', result);
    } catch (error) {
      next(error);
    }
  },

  enrollCourse: async (req, res, next) => { try { sendResponse(res, 201, true, 'Enrolled successfully', await courseService.enrollCourse(req.user.id, req.params.id)); } catch (error) { next(error); } },
  getEnrolledCourses: async (req, res, next) => { try { sendResponse(res, 200, true, 'Enrolled courses retrieved', await courseService.getUserEnrollments(req.user.id)); } catch (error) { next(error); } },
  completeCourse: async (req, res, next) => { try { sendResponse(res, 200, true, 'Course marked as completed', await courseService.completeCourse(req.user.id, req.params.courseId)); } catch (error) { next(error); } },
  createCourse: async (req, res, next) => { try { sendResponse(res, 201, true, 'Course created', await courseService.createCourse(req.body)); } catch (error) { next(error); } },
  updateCourse: async (req, res, next) => { try { sendResponse(res, 200, true, 'Course updated', await courseService.updateCourse(req.params.id, req.body)); } catch (error) { next(error); } },
  deleteCourse: async (req, res, next) => { try { await courseService.deleteCourse(req.params.id); sendResponse(res, 200, true, 'Course deleted'); } catch (error) { next(error); } },
  createChapter: async (req, res, next) => { try { sendResponse(res, 201, true, 'Chapter created', await courseService.createChapter(req.body)); } catch (error) { next(error); } },
  updateChapter: async (req, res, next) => { try { sendResponse(res, 200, true, 'Chapter updated', await courseService.updateChapter(req.params.id, req.body)); } catch (error) { next(error); } },
  deleteChapter: async (req, res, next) => { try { await courseService.deleteChapter(req.params.id); sendResponse(res, 200, true, 'Chapter deleted'); } catch (error) { next(error); } },
  createLesson: async (req, res, next) => { try { sendResponse(res, 201, true, 'Lesson created', await courseService.createLesson(req.body)); } catch (error) { next(error); } },
  updateLesson: async (req, res, next) => { try { sendResponse(res, 200, true, 'Lesson updated', await courseService.updateLesson(req.params.id, req.body)); } catch (error) { next(error); } },
  deleteLesson: async (req, res, next) => { try { await courseService.deleteLesson(req.params.id); sendResponse(res, 200, true, 'Lesson deleted'); } catch (error) { next(error); } },
  getAllCoursesAdmin: async (req, res, next) => { try { const { page, limit } = req.query; sendResponse(res, 200, true, 'All courses retrieved', await courseService.getAllCoursesAdmin({ page, limit })); } catch (error) { next(error); } },

  initCourseVideoUpload: async (req, res, next) => {
    try {
      const result = await courseService.initCourseVideoUpload({ courseId: req.params.id, ...req.body });
      sendResponse(res, 200, true, 'Upload initialized', result);
    } catch (error) {
      next(error);
    }
  },

  signCourseVideoPart: async (req, res, next) => {
    try {
      const result = await courseService.signCourseVideoPart(req.body);
      sendResponse(res, 200, true, 'Part signed', result);
    } catch (error) {
      next(error);
    }
  },

  completeCourseVideoUpload: async (req, res, next) => {
    try {
      const result = await courseService.completeCourseVideoUpload({ courseId: req.params.id, ...req.body });
      sendResponse(res, 200, true, 'Upload completed', result);
    } catch (error) {
      next(error);
    }
  },

  initCourseCoverUpload: async (req, res, next) => {
    try {
      const result = await courseService.initCourseCoverUpload({ courseId: req.params.id, ...req.body });
      sendResponse(res, 200, true, 'Cover upload initialized', result);
    } catch (error) {
      next(error);
    }
  },

  completeCourseCoverUpload: async (req, res, next) => {
    try {
      const result = await courseService.completeCourseCoverUpload({ courseId: req.params.id, ...req.body });
      sendResponse(res, 200, true, 'Cover upload completed', result);
    } catch (error) {
      next(error);
    }
  },

  abortCourseVideoUpload: async (req, res, next) => {
    try {
      await courseService.abortCourseVideoUpload(req.body);
      sendResponse(res, 200, true, 'Upload aborted');
    } catch (error) {
      next(error);
    }
  },

  abortCourseCoverUpload: async (req, res, next) => {
    try {
      await courseService.abortCourseCoverUpload(req.body);
      sendResponse(res, 200, true, 'Cover upload aborted');
    } catch (error) {
      next(error);
    }
  },

  deleteCourseVideo: async (req, res, next) => {
    try {
      await courseService.deleteCourseVideo(req.params.id);
      sendResponse(res, 200, true, 'Video deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteCourseCover: async (req, res, next) => {
    try {
      await courseService.deleteCourseCover(req.params.id);
      sendResponse(res, 200, true, 'Cover deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = courseController;
