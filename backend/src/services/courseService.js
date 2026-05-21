const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const courseService = {
  // Get courses with pagination and filters
  getCourses: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, dynasty, difficulty, search }) => {
    const query = { isPublished: true };

    if (dynasty) query.dynasty = dynasty;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [courses, total] = await Promise.all([
      Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Course.countDocuments(query),
    ]);

    return {
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        itemsPerPage: safeLimit,
      },
    };
  },

  // Get course detail with chapters and lessons
  getCourseDetail: async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const chapters = await Chapter.find({ courseId }).sort({ order: 1 });
    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

    // Build chapter tree with lessons
    const chapterTree = chapters.map((chapter) => ({
      ...chapter.toObject(),
      lessons: lessons.filter(
        (lesson) => lesson.chapterId.toString() === chapter._id.toString()
      ),
    }));

    return { course, chapters: chapterTree };
  },

  // Enroll user to course
  enrollCourse: async (userId, courseId) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) throw new Error('Already enrolled in this course');

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    return enrollment;
  },

  // Get user enrollments
  getUserEnrollments: async (userId) => {
    return await Enrollment.find({ userId })
      .populate('courseId', 'title thumbnail dynasty difficulty')
      .sort({ enrolledAt: -1 });
  },

  // Mark lesson as completed
  completeLesson: async (userId, courseId, lessonId) => {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) throw new Error('Not enrolled in this course');

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);

      // Calculate progress
      const totalLessons = await Lesson.countDocuments({ courseId });
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );

      if (enrollment.progress >= 100) {
        enrollment.completedAt = new Date();
      }

      await enrollment.save();
    }

    return enrollment;
  },

  // Admin: CRUD Course
  createCourse: async (data) => {
    const course = new Course(data);
    return await course.save();
  },

  updateCourse: async (courseId, data) => {
    const course = await Course.findByIdAndUpdate(courseId, data, {
      new: true,
      runValidators: true,
    });
    if (!course) throw new Error('Course not found');
    return course;
  },

  deleteCourse: async (courseId) => {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) throw new Error('Course not found');

    // Cascade delete chapters, lessons
    await Chapter.deleteMany({ courseId });
    await Lesson.deleteMany({ courseId });

    return course;
  },

  // Admin: CRUD Chapter
  createChapter: async (data) => {
    const course = await Course.findById(data.courseId);
    if (!course) throw new Error('Course not found');

    const chapter = new Chapter(data);
    return await chapter.save();
  },

  updateChapter: async (chapterId, data) => {
    const chapter = await Chapter.findByIdAndUpdate(chapterId, data, {
      new: true,
      runValidators: true,
    });
    if (!chapter) throw new Error('Chapter not found');
    return chapter;
  },

  deleteChapter: async (chapterId) => {
    const chapter = await Chapter.findByIdAndDelete(chapterId);
    if (!chapter) throw new Error('Chapter not found');

    // Cascade delete lessons in this chapter
    await Lesson.deleteMany({ chapterId });

    return chapter;
  },

  // Admin: CRUD Lesson
  createLesson: async (data) => {
    const chapter = await Chapter.findById(data.chapterId);
    if (!chapter) throw new Error('Chapter not found');

    // Auto-set courseId from chapter
    data.courseId = chapter.courseId;

    const lesson = new Lesson(data);
    return await lesson.save();
  },

  updateLesson: async (lessonId, data) => {
    const lesson = await Lesson.findByIdAndUpdate(lessonId, data, {
      new: true,
      runValidators: true,
    });
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  deleteLesson: async (lessonId) => {
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  // Admin: Get all courses (including unpublished)
  getAllCoursesAdmin: async ({ page = 1, limit = DEFAULT_PAGE_SIZE }) => {
    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [courses, total] = await Promise.all([
      Course.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Course.countDocuments(),
    ]);

    return {
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        itemsPerPage: safeLimit,
      },
    };
  },
};

module.exports = courseService;
