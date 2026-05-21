const Lesson = require('../models/Lesson');
const { sendResponse } = require('../utils/response');

const lessonController = {
  // GET /api/lessons/:id
  getLessonDetail: async (req, res, next) => {
    try {
      const lesson = await Lesson.findById(req.params.id)
        .populate('chapterId', 'title order')
        .populate('courseId', 'title');

      if (!lesson) {
        return sendResponse(res, 404, false, 'Lesson not found');
      }

      sendResponse(res, 200, true, 'Lesson retrieved', lesson);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/lessons/chapter/:chapterId
  getLessonsByChapter: async (req, res, next) => {
    try {
      const lessons = await Lesson.find({ chapterId: req.params.chapterId }).sort({
        order: 1,
      });
      sendResponse(res, 200, true, 'Lessons retrieved', lessons);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = lessonController;
