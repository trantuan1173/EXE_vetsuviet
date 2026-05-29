const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const storageService = require('./storageService');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const PRESIGNED_TTL_SECONDS = parseInt(process.env.VIDEO_PLAYBACK_URL_TTL_SECONDS || '600', 10);
const MAX_VIDEO_SIZE_BYTES = parseInt(process.env.MAX_VIDEO_SIZE_BYTES || `${5 * 1024 * 1024 * 1024}`, 10);
const MAX_COVER_IMAGE_SIZE_BYTES = parseInt(process.env.MAX_COVER_IMAGE_SIZE_BYTES || `${10 * 1024 * 1024}`, 10);
const ALLOWED_COVER_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const withSignedCoverUrl = async (course) => {
  if (!course) return course;

  const plain = typeof course.toObject === 'function' ? course.toObject() : { ...course };

  if (!course.coverImageKey) return plain;

  try {
    const signedUrl = await storageService.getSignedPlaybackUrl(course.coverImageKey, PRESIGNED_TTL_SECONDS);
    plain.thumbnail = signedUrl;
  } catch {
    // Storage not configured or unavailable – keep existing thumbnail (if any)
  }

  return plain;
};

const withSignedCoverUrls = async (courses) => Promise.all((courses || []).map(withSignedCoverUrl));

const courseService = {
  getCourses: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, dynasty, difficulty, search }) => {
    const query = { isPublished: true };
    if (dynasty) query.dynasty = dynasty;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;
    const [courses, total] = await Promise.all([Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit), Course.countDocuments(query)]);
    const normalizedCourses = await withSignedCoverUrls(courses);
    return { courses: normalizedCourses, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / safeLimit), totalItems: total, itemsPerPage: safeLimit } };
  },

  getCourseDetail: async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    const normalizedCourse = await withSignedCoverUrl(course);
    return { course: normalizedCourse };
  },

  enrollCourse: async (userId, courseId) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) throw new Error('Already enrolled in this course');
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    return enrollment;
  },

  getUserEnrollments: async (userId) => Enrollment.find({ userId }).populate('courseId', 'title thumbnail dynasty difficulty').sort({ enrolledAt: -1 }),

  completeCourse: async (userId, courseId) => {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) throw new Error('Not enrolled in this course');
    enrollment.progress = 100;
    enrollment.completedAt = enrollment.completedAt || new Date();
    await enrollment.save();
    return enrollment;
  },

  createCourse: async (data) => new Course(data).save(),

  updateCourse: async (courseId, data) => {
    const course = await Course.findByIdAndUpdate(courseId, data, { new: true, runValidators: true });
    if (!course) throw new Error('Course not found');
    return course;
  },

  deleteCourse: async (courseId) => {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) throw new Error('Course not found');
    await Promise.all([storageService.deleteObject(course.videoKey), storageService.deleteObject(course.coverImageKey)]);
    return course;
  },

  createChapter: async (data) => {
    const course = await Course.findById(data.courseId);
    if (!course) throw new Error('Course not found');
    return new Chapter(data).save();
  },

  updateChapter: async (chapterId, data) => {
    const chapter = await Chapter.findByIdAndUpdate(chapterId, data, { new: true, runValidators: true });
    if (!chapter) throw new Error('Chapter not found');
    return chapter;
  },

  deleteChapter: async (chapterId) => {
    const chapter = await Chapter.findByIdAndDelete(chapterId);
    if (!chapter) throw new Error('Chapter not found');
    await Lesson.deleteMany({ chapterId });
    return chapter;
  },

  createLesson: async (data) => {
    const chapter = await Chapter.findById(data.chapterId);
    if (!chapter) throw new Error('Chapter not found');
    data.courseId = chapter.courseId;
    return new Lesson(data).save();
  },

  updateLesson: async (lessonId, data) => {
    const lesson = await Lesson.findByIdAndUpdate(lessonId, data, { new: true, runValidators: true });
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  deleteLesson: async (lessonId) => {
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  getAllCoursesAdmin: async ({ page = 1, limit = DEFAULT_PAGE_SIZE }) => {
    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;
    const [courses, total] = await Promise.all([Course.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit), Course.countDocuments()]);
    const normalizedCourses = await withSignedCoverUrls(courses);
    return { courses: normalizedCourses, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / safeLimit), totalItems: total, itemsPerPage: safeLimit } };
  },

  initCourseVideoUpload: async ({ courseId, fileName, contentType, fileSize }) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    if (!fileSize || fileSize > MAX_VIDEO_SIZE_BYTES) throw new Error('Video size exceeds limit');
    const safeName = (fileName || 'video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `courses/${courseId}/videos/${Date.now()}-${safeName}`;
    const upload = await storageService.createMultipartUpload({ key, contentType: contentType || 'video/mp4' });
    return { uploadId: upload.UploadId, key, partSize: 8 * 1024 * 1024 };
  },

  initCourseCoverUpload: async ({ courseId, fileName, contentType, fileSize }) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    if (!fileSize || fileSize > MAX_COVER_IMAGE_SIZE_BYTES) throw new Error('Cover image size exceeds limit');
    const normalizedType = contentType || 'image/jpeg';
    if (!ALLOWED_COVER_IMAGE_TYPES.has(normalizedType)) throw new Error('Invalid cover image type');
    const safeName = (fileName || 'cover.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `courses/${courseId}/covers/${Date.now()}-${safeName}`;
    const upload = await storageService.createMultipartUpload({ key, contentType: normalizedType });
    return { uploadId: upload.UploadId, key, partSize: 5 * 1024 * 1024 };
  },

  signCourseVideoPart: async ({ key, uploadId, partNumber }) => {
    if (!partNumber || partNumber < 1) throw new Error('Invalid partNumber');
    const signedUrl = await storageService.getUploadPartSignedUrl({ key, uploadId, partNumber });
    return { signedUrl };
  },

  completeCourseVideoUpload: async ({ courseId, key, uploadId, parts, contentType, fileSize }) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    await storageService.completeMultipartUpload({ key, uploadId, parts });
    if (course.videoKey && course.videoKey !== key) await storageService.deleteObject(course.videoKey);
    course.videoKey = key;
    course.videoUrl = `/api/courses/${courseId}/video/playback`;
    course.videoMimeType = contentType || 'video/mp4';
    course.videoSize = fileSize || 0;
    await course.save();
    return { course };
  },

  completeCourseCoverUpload: async ({ courseId, key, uploadId, parts, contentType, fileSize }) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    const normalizedType = contentType || 'image/jpeg';
    if (!ALLOWED_COVER_IMAGE_TYPES.has(normalizedType)) throw new Error('Invalid cover image type');
    if (!fileSize || fileSize > MAX_COVER_IMAGE_SIZE_BYTES) throw new Error('Cover image size exceeds limit');

    await storageService.completeMultipartUpload({ key, uploadId, parts });
    if (course.coverImageKey && course.coverImageKey !== key) await storageService.deleteObject(course.coverImageKey);

    const playbackUrl = await storageService.getSignedPlaybackUrl(key, PRESIGNED_TTL_SECONDS);

    course.coverImageKey = key;
    course.coverImageMimeType = normalizedType;
    course.coverImageSize = fileSize || 0;
    course.thumbnail = playbackUrl;
    await course.save();
    const normalizedCourse = await withSignedCoverUrl(course);
    return { course: normalizedCourse };
  },

  abortCourseVideoUpload: async ({ key, uploadId }) => storageService.abortMultipartUpload({ key, uploadId }),
  abortCourseCoverUpload: async ({ key, uploadId }) => storageService.abortMultipartUpload({ key, uploadId }),

  getCoursePlaybackUrl: async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course || !course.videoKey) throw new Error('Video not found');
    const playbackUrl = await storageService.getSignedPlaybackUrl(course.videoKey, PRESIGNED_TTL_SECONDS);
    return { playbackUrl, expiresIn: PRESIGNED_TTL_SECONDS };
  },
};

module.exports = courseService;
