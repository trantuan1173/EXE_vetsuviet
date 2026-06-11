import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/courses', label: 'Khóa học', icon: '📚' },
  { path: '/admin/quizzes', label: 'Quiz', icon: '❓' },
  { path: '/admin/products', label: 'Sản phẩm', icon: '🛒' },
  { path: '/admin/orders', label: 'Đơn hàng', icon: '📦' },
  { path: '/admin/enrollments', label: 'Đăng ký khóa học', icon: '🎓' },
  { path: '/admin/users', label: 'Người dùng', icon: '👥' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="text-xl font-heading font-bold text-white">
          🎌 Vết Sử Việt
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="mt-4">
        {menuItems.map(({ path, label, icon }) => {
          const isActive =
            path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(path);

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white border-r-4 border-primary-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300"
        >
          ← Về trang chính
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
