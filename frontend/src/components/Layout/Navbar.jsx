import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import logoIcon from '../../assets/Logo 3 1.png';
import logoText from '../../assets/Logo text 3 1.png';

const navItems = [
  { to: '/', label: 'Trang chủ' },
  { to: '/courses', label: 'Khóa học' },
  { to: '/shop', label: 'Sản phẩm' },
  { to: '/#community', label: 'Cộng đồng' },
  { to: '/#about', label: 'Về chúng tôi' },
];

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const isHomePage = location.pathname === '/';
  const navClassName = isHomePage
    ? 'absolute top-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-[1360px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-md'
    : 'sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100';

  const linkClassName = isHomePage
    ? 'text-white/85 hover:text-white font-serif text-[16px]'
    : 'text-gray-700 hover:text-[#6F0D0D] font-medium';

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to.includes('#')) return false;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className={navClassName}>
      <div className={isHomePage ? 'px-6 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        <div className={isHomePage ? 'flex justify-between items-center min-h-[72px]' : 'flex justify-between items-center h-16'}>
          <Link to="/" className="flex items-center gap-3">
            <img src={logoIcon} alt="Vết Sử Việt Logo" className={isHomePage ? 'h-[52px] w-auto' : 'h-10 w-auto'} />
            <img src={logoText} alt="Vết Sử Việt" className={isHomePage ? 'h-[34px] w-auto' : 'h-7 w-auto'} />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`${linkClassName} ${isActive(item.to) ? (isHomePage ? 'text-white border-b-2 border-[#D4AF37] pb-1' : 'text-[#6F0D0D]') : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/cart" className="relative">
              <svg
                className={`w-6 h-6 ${isHomePage ? 'text-white hover:text-[#FFD36E]' : 'text-gray-700 hover:text-[#6F0D0D]'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#6F0D0D] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 ${isHomePage ? 'text-white hover:text-[#FFD36E]' : 'text-gray-700 hover:text-[#6F0D0D]'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isHomePage ? 'bg-white/20' : 'bg-[#F9EFD2]'}`}>
                    <span className={`font-semibold text-sm ${isHomePage ? 'text-white' : 'text-[#6F0D0D]'}`}>
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium max-w-[140px] truncate">{user?.fullName}</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm bg-[#D4AF37] text-[#6F0D0D] px-3 py-1.5 rounded-lg hover:opacity-90 font-bold"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className={`text-sm ${isHomePage ? 'text-white/90 hover:text-red-200' : 'text-gray-600 hover:text-red-600'}`}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={
                    isHomePage
                      ? 'px-5 py-2 rounded border border-white text-white font-serif text-[16px] hover:bg-white/10'
                      : 'text-sm text-gray-700 hover:text-[#6F0D0D] font-medium'
                  }
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className={
                    isHomePage
                      ? 'px-5 py-2 rounded bg-[#D4AF37] text-[#6F0D0D] font-bold text-[16px] hover:opacity-95'
                      : 'text-sm bg-[#6F0D0D] text-white px-4 py-2 rounded-lg hover:bg-[#5A0A0A]'
                  }
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;