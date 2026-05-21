const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const QuizHistory = require('../models/QuizHistory');
const Order = require('../models/Order');
const RewardTransaction = require('../models/RewardTransaction');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const userService = {
  // Get user full profile
  getUserProfile: async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  // Update user profile (fullName, avatar only)
  updateProfile: async (userId, { fullName, avatar }) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error('Current password is incorrect');

    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  },

  // Get user quiz history
  getQuizHistory: async (userId) => {
    return await QuizHistory.find({ userId })
      .populate('quizId', 'title xpReward')
      .populate('courseId', 'title')
      .sort({ completedAt: -1 });
  },

  // Get user XP transactions
  getXPHistory: async (userId) => {
    return await RewardTransaction.find({ userId }).sort({ createdAt: -1 });
  },

  // Admin: Get all users
  getAllUsers: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, search }) => {
    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
      },
    };
  },

  // Admin: Get user detail
  getUserById: async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');

    const [enrollments, orders, xpHistory] = await Promise.all([
      Enrollment.find({ userId }).populate('courseId', 'title thumbnail'),
      Order.find({ userId })
        .populate('items.productId', 'name price')
        .sort({ createdAt: -1 })
        .limit(10),
      RewardTransaction.find({ userId }).sort({ createdAt: -1 }).limit(20),
    ]);

    return { user, enrollments, orders, xpHistory };
  },

  // Admin: Toggle user active status
  toggleUserStatus: async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot disable admin account');

    user.isActive = !user.isActive;
    await user.save();
    return user;
  },

  // Admin: Stats
  getUserStats: async () => {
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(new Date().setDate(1)) },
      }),
    ]);
    return { totalUsers, activeUsers, newUsersThisMonth };
  },
};

module.exports = userService;
