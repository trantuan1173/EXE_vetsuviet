const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');
const { sendResponse } = require('../utils/response');

/**
 * GET /admin/enrollments
 * List all enrollments with search, filter, pagination
 */
exports.getAllEnrollments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      isPaid,
      courseId,
      userId,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Build filter
    const filter = {};
    if (isPaid !== undefined && isPaid !== '') {
      filter.isPaid = isPaid === 'true';
    }
    if (courseId) {
      filter.courseId = courseId;
    }
    if (userId) {
      filter.userId = userId;
    }

    // If search is provided, find matching users first
    let userIds = null;
    if (search) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      userIds = users.map((u) => u._id);

      // Also search courses by title
      const courses = await Course.find({
        title: { $regex: search, $options: 'i' },
      }).select('_id');
      const courseIds = courses.map((c) => c._id);

      filter.$or = [
        { userId: { $in: userIds } },
        { courseId: { $in: courseIds } },
      ];
    }

    const total = await Enrollment.countDocuments(filter);
    const enrollments = await Enrollment.find(filter)
      .populate('userId', 'fullName email avatar')
      .populate('courseId', 'title thumbnail dynasty difficulty')
      .populate('approvedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return sendResponse(res, 200, true, 'Lấy danh sách đăng ký thành công', {
      enrollments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getAllEnrollments error:', error);
    return sendResponse(res, 500, false, 'Lỗi khi lấy danh sách đăng ký');
  }
};

/**
 * POST /admin/enrollments
 * Create a new enrollment (admin adds student to course)
 */
exports.createEnrollment = async (req, res) => {
  try {
    const { userId, courseId, isPaid, note } = req.body;

    if (!userId || !courseId) {
      return sendResponse(res, 400, false, 'userId và courseId là bắt buộc');
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, 'Không tìm thấy người dùng');
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return sendResponse(res, 404, false, 'Không tìm thấy khóa học');
    }

    // Check duplicate
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return sendResponse(res, 409, false, 'Học sinh đã được đăng ký khóa học này rồi');
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      isPaid: isPaid || false,
      paidAt: isPaid ? new Date() : null,
      approvedBy: isPaid ? req.user._id : null,
      note: note || '',
    });

    // Populate for response
    const populated = await Enrollment.findById(enrollment._id)
      .populate('userId', 'fullName email avatar')
      .populate('courseId', 'title thumbnail dynasty difficulty')
      .populate('approvedBy', 'fullName email');

    return sendResponse(res, 201, true, 'Tạo đăng ký thành công', populated);
  } catch (error) {
    console.error('createEnrollment error:', error);
    if (error.code === 11000) {
      return sendResponse(res, 409, false, 'Học sinh đã được đăng ký khóa học này rồi');
    }
    return sendResponse(res, 500, false, 'Lỗi khi tạo đăng ký');
  }
};

/**
 * PUT /admin/enrollments/:id/toggle-paid
 * Toggle payment status
 */
exports.togglePaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return sendResponse(res, 404, false, 'Không tìm thấy đăng ký');
    }

    enrollment.isPaid = !enrollment.isPaid;
    enrollment.paidAt = enrollment.isPaid ? new Date() : null;
    enrollment.approvedBy = enrollment.isPaid ? req.user._id : null;
    if (note !== undefined) {
      enrollment.note = note;
    }

    await enrollment.save();

    const populated = await Enrollment.findById(enrollment._id)
      .populate('userId', 'fullName email avatar')
      .populate('courseId', 'title thumbnail dynasty difficulty')
      .populate('approvedBy', 'fullName email');

    return sendResponse(res, 200, true, 'Cập nhật trạng thái thanh toán thành công', populated);
  } catch (error) {
    console.error('togglePaid error:', error);
    return sendResponse(res, 500, false, 'Lỗi khi cập nhật trạng thái thanh toán');
  }
};

/**
 * DELETE /admin/enrollments/:id
 * Remove an enrollment
 */
exports.deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) {
      return sendResponse(res, 404, false, 'Không tìm thấy đăng ký');
    }

    return sendResponse(res, 200, true, 'Đã xóa đăng ký thành công');
  } catch (error) {
    console.error('deleteEnrollment error:', error);
    return sendResponse(res, 500, false, 'Lỗi khi xóa đăng ký');
  }
};