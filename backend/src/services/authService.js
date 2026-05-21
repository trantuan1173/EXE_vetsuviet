const User = require('../models/User');
const { generateToken } = require('../config/jwt');

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
