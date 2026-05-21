export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DYNASTIES = [
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

export const DIFFICULTY_LEVELS = [
  { value: 'basic', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung bình' },
  { value: 'advanced', label: 'Nâng cao' },
];

export const ORDER_STATUS = [
  { value: 'pending', label: 'Đang xử lý', color: 'yellow' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'card', label: 'Thẻ tín dụng' },
  { value: 'bank', label: 'Chuyển khoản' },
];

export const XP_PER_LEVEL = 100;
