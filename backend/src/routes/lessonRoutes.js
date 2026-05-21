const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// GET /api/lessons/:id
router.get('/:id', lessonController.getLessonDetail);

// GET /api/lessons/chapter/:chapterId
router.get('/chapter/:chapterId', lessonController.getLessonsByChapter);

module.exports = router;
