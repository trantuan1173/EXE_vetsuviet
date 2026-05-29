export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DYNASTIES = [
  { value: 'Thời Hùng Vương', label: 'Thời Hùng Vương' },
  { value: 'Thời Triệu', label: 'Thời Triệu' },
  { value: 'Thời Tiền Lý', label: 'Thời Tiền Lý' },
  { value: 'Thời Triệu Việt Vương', label: 'Thời Triệu Việt Vương' },
  { value: 'Thời Hậu Lý', label: 'Thời Hậu Lý' },
  { value: 'Thời Ngô', label: 'Thời Ngô' },
  { value: 'Thời Đinh', label: 'Thời Đinh' },
  { value: 'Thời Tiền Lê', label: 'Thời Tiền Lê' },
  { value: 'Thời Lý', label: 'Thời Lý' },
  { value: 'Thời Trần', label: 'Thời Trần' },
  { value: 'Thời Hồ', label: 'Thời Hồ' },
  { value: 'Thời Hậu Lê', label: 'Thời Hậu Lê' },
  { value: 'Thời Mạc', label: 'Thời Mạc' },
  { value: 'Thời Tây Sơn', label: 'Thời Tây Sơn' },
  { value: 'Thời Nguyễn', label: 'Thời Nguyễn' },
  { value: 'Tổng hợp', label: 'Tổng hợp' }
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
