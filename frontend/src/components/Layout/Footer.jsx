import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              🎌 Vết Sử Việt
            </h3>
            <p className="text-sm text-gray-400">
              Nền tảng học tập lịch sử Việt Nam qua quiz tương tác và gamification.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Khóa học</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="hover:text-primary-400">
                  Tất cả khóa học
                </Link>
              </li>
              <li>
                <Link to="/courses?difficulty=basic" className="hover:text-primary-400">
                  Cơ bản
                </Link>
              </li>
              <li>
                <Link to="/courses?difficulty=advanced" className="hover:text-primary-400">
                  Nâng cao
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-3">Cửa hàng</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-primary-400">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400">
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white mb-3">Tài khoản</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-primary-400">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-400">
                  Hồ sơ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 Vết Sử Việt. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-400">
                Privacy
              </a>
              <a href="#" className="hover:text-primary-400">
                Terms
              </a>
              <a href="#" className="hover:text-primary-400">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
