import { Link } from 'react-router-dom';
import logoIcon from '../../assets/Logo 3 1.png';
import logoText from '../../assets/Logo text 3 1.png';

const Footer = () => {
  return (
    <footer id="about" className="bg-[#601407] text-white mt-0">
      <div className="mx-auto max-w-[1440px] px-8 py-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="Vết Sử Việt Logo" className="h-[78px] w-auto" />
          <img src={logoText} alt="Vết Sử Việt" className="h-[51px] w-auto" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link to="/about" className="text-white text-base font-normal underline hover:text-white/80 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Về chúng tôi
          </Link>
          <Link to="/privacy" className="text-white text-base font-normal underline hover:text-white/80 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Chính sách bảo mật
          </Link>
          <Link to="/terms" className="text-white text-base font-normal underline hover:text-white/80 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Điều khoản sử dụng
          </Link>
          <Link to="/contact" className="text-white text-base font-normal underline hover:text-white/80 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Liên hệ
          </Link>
        </nav>

        {/* Social Media Icons */}
        <div className="flex items-center gap-6">
          {/* Facebook */}
          <a href="https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.896 0H1.104C0.494 0 0 0.494 0 1.104v17.792C0 19.506 0.494 20 1.104 20h9.579v-7.745H8.076V9.237h2.607V7.01c0-2.583 1.578-3.99 3.883-3.99 1.104 0 2.052 0.082 2.329 0.119v2.7h-1.598c-1.254 0-1.496 0.596-1.496 1.47v1.927h2.989l-0.389 3.018h-2.6V20h5.098C19.506 20 20 19.506 20 18.896V1.104C20 0.494 19.506 0 18.896 0z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
            <svg width="21" height="15" viewBox="0 0 21 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.593 2.203a2.63 2.63 0 0 0-1.852-1.852C17.11 0 10.5 0 10.5 0S3.89 0 2.259 0.351A2.63 2.63 0 0 0 0.407 2.203C0.056 3.834 0 7.5 0 7.5s0.056 3.666 0.407 5.297a2.63 2.63 0 0 0 1.852 1.852C3.89 15 10.5 15 10.5 15s6.61 0 8.241-0.351a2.63 2.63 0 0 0 1.852-1.852C20.944 11.166 21 7.5 21 7.5s-0.056-3.666-0.407-5.297zM8.4 10.714V4.286L13.85 7.5 8.4 10.714z"/>
            </svg>
          </a>
          {/* TikTok */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525 0h-3.1v13.6c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c0.3 0 0.6 0.05 0.9 0.15V7.7c-0.3-0.05-0.6-0.05-0.9-0.05C2.925 7.65 0 10.575 0 14.175S2.925 20 6.525 20s6.525-2.575 6.525-6.175V6.8c1.5 1.1 3.35 1.75 5.35 1.75V5.45c-3.05 0-5.525-2.45-5.875-5.45z"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-white text-xs font-medium text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
          © 2026 Vết Sử Việt. Lan tỏa sử ta
        </p>
      </div>
    </footer>
  );
};

export default Footer;