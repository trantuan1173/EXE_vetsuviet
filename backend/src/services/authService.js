const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const emailService = require('./emailService');

const authService = {
  // Register new user
  register: async (email, password, fullName) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User({ email, password, fullName });
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });
    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
      token,
    };
  },

  // Login user
  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    const token = generateToken({ id: user._id, role: user.role });
    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
      token,
    };
  },

  // Get user profile
  getProfile: async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  // Update user profile
  updateProfile: async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  // Forgot password - generate token and send email
  forgotPassword: async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email không tồn tại trong hệ thống');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await emailService.sendResetPasswordEmail(user.email, resetToken);
    } catch (err) {
      // If email fails, clear the token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    // Hash the token from URL to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Set new password and clear reset fields
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
  },

  // Add XP to user
  addXP: async (userId, xpAmount) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.xp += xpAmount;
    user.calculateLevel();
    await user.save();

    return user;
  },
};

module.exports = authService;
