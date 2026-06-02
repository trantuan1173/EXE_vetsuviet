import { Link } from 'react-router-dom';
import logoIcon from '../../assets/Logo 3 1.png';
import logoText from '../../assets/Logo text 3 1.png';

const Footer = () => {
  return (
    <footer id="about" className="bg-[#6F0D0D] text-white px-4 sm:px-6 py-12 sm:py-16 mt-0">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <img src={logoIcon} alt="Vết Sử Việt Logo" className="h-8 sm:h-10 w-auto" />
            <img src={logoText} alt="Vết Sử Việt" className="h-6 sm:h-7 w-auto" />
          </Link>
          <p className="text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
            Nền tảng học lịch sử Việt Nam sinh động, dễ hiểu, dành cho mọi lứa tuổi. Chú trọng vào trải nghiệm người
            dùng và tính chính xác của dữ liệu lịch sử.
          </p>
        </div>

        <div>
          <h4 className="text-[#D4AF37] text-lg sm:text-xl font-bold mb-4 sm:mb-5">Khóa học</h4>
          <ul className="space-y-2 sm:space-y-3 text-white/70 text-sm sm:text-base">
            <li>
              <Link to="/courses" className="hover:text-white transition-colors">
                Thời kỳ dựng nước
              </Link>
            </li>
            <li>
              <Link to="/courses?difficulty=basic" className="hover:text-white transition-colors">
                Thời kỳ phong kiến
              </Link>
            </li>
            <li>
              <Link to="/courses?difficulty=advanced" className="hover:text-white transition-colors">
                Thời kỳ cận đại
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-white transition-colors">
                Thời kỳ hiện đại
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#D4AF37] text-lg sm:text-xl font-bold mb-4 sm:mb-5">Hỗ trợ</h4>
          <ul className="space-y-2 sm:space-y-3 text-white/70 text-sm sm:text-base">
            <li>
              <Link to="/courses" className="hover:text-white transition-colors">
                Hướng dẫn sử dụng
              </Link>
            </li>
            <li>
              <Link to="/quiz/course/1" className="hover:text-white transition-colors">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#D4AF37] text-lg sm:text-xl font-bold mb-4 sm:mb-5">Liên hệ</h4>
          <ul className="space-y-2 sm:space-y-3 text-white/70 text-sm sm:text-base">
            <li>
              <span className="text-[#D4AF37]/70">Email:</span> contact@vetsuviet.vn
            </li>
            <li>
              <span className="text-[#D4AF37]/70">Hotline:</span> 1900 1234
            </li>
            <li>
              <span className="text-[#D4AF37]/70">Địa chỉ:</span> Hà Nội, Việt Nam
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20 text-center text-white/50 text-xs sm:text-sm">
        © 2024 Vết Sử Việt. Bản quyền thuộc về đội ngũ phát triển Vết Sử Việt.
      </div>
    </footer>
  );
};

export default Footer;