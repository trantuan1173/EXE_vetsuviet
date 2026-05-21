// XP & Level constants
const XP_PER_LEVEL = 100; // XP cần để lên 1 level
const DEFAULT_XP_REWARD = 10; // XP mặc định khi hoàn thành quiz
const DEFAULT_PASSING_SCORE = 70; // % điểm đạt mặc định

// Pagination
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Dynasties (Triều đại)
const DYNASTIES = [
  'Hùng Vương',
  'An Dương Vương',
  'Triệu',
  'Tiền Lý',
  'Triệu Việt Vương',
  'Hậu Lý',
  'Ngô',
  'Đinh',
  'Tiền Lê',
  'Lý',
  'Trần',
  'Hồ',
  'Hậu Lê',
  'Mạc',
  'Tây Sơn',
  'Nguyễn',
  'Tổng hợp',
];

// Difficulty levels
const DIFFICULTY_LEVELS = ['basic', 'intermediate', 'advanced'];

// Order status
const ORDER_STATUS = ['pending', 'completed', 'cancelled'];

// Payment methods
const PAYMENT_METHODS = ['cash', 'card', 'bank'];

// User roles
const USER_ROLES = ['user', 'admin'];

module.exports = {
  XP_PER_LEVEL,
  DEFAULT_XP_REWARD,
  DEFAULT_PASSING_SCORE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DYNASTIES,
  DIFFICULTY_LEVELS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  USER_ROLES,
};
