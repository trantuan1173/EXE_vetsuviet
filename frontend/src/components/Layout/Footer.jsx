import { Link } from 'react-router-dom';
import logoIcon from '../../assets/Logo 3 1.png';
import logoText from '../../assets/Logo text 3 1.png';

const footerColumns = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Trang chủ', to: '/' },
      { label: 'Khoá học', to: '/courses' },
      { label: 'Sản phẩm', to: '/shop' },
    ],
  },
  {
    title: 'Vết sử Việt',
    links: [
      { label: 'Về chúng tôi', to: '/about' },
      { label: 'Đăng ký', to: '/register' },
    ],
  },
];

const contactItems = [
  {
    label: 'vetsuvietproject@gmail.com',
    href: 'mailto:vetsuvietproject@gmail.com',
    icon: (
      <svg viewBox="0 0 18 18" className="h-[17.33px] w-[17.33px]" fill="none" aria-hidden="true">
        <path
          d="M3 4.5h12a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 15 15H3a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 3 4.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m1.875 5.625 6.246 4.372a1.5 1.5 0 0 0 1.758 0l6.246-4.372"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Hà Nội - Việt Nam',
    href: 'https://maps.google.com/?q=H%C3%A0%20N%E1%BB%99i%20Vi%E1%BB%87t%20Nam',
    icon: (
      <svg viewBox="0 0 19 19" className="h-[18.66px] w-[18.66px]" fill="none" aria-hidden="true">
        <path
          d="M15.042 7.917c0 4.75-5.542 8.708-5.542 8.708S3.958 12.667 3.958 7.917a5.542 5.542 0 1 1 11.084 0Z"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 9.5a1.583 1.583 0 1 0 0-3.167A1.583 1.583 0 0 0 9.5 9.5Z"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: '0862588164',
    href: 'tel:0862588164',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18.66px] w-[18.66px]" fill="none" aria-hidden="true">
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer id="about" className="bg-[#601407] text-white">
      {/* Container giới hạn chiều rộng và căn giữa */}
      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 lg:px-24">
        
        {/* Hàng chính: Chia Logo và Các cột Links */}
        <div className="flex flex-col gap-10 text-center sm:text-left lg:flex-row lg:justify-between lg:items-start lg:gap-20">
          
          {/* Khối Logo */}
          <Link
            to="/"
            className="flex flex-col items-center shrink-0 sm:items-start"
            aria-label="Vết Sử Việt - Trang chủ"
          >
            <img src={logoIcon} alt="Vết Sử Việt Logo" className="h-[85px] w-[52px] object-contain" />
            <img src={logoText} alt="Vết Sử Việt" className="mt-2 h-[38px] w-[131px] object-contain" />
          </Link>

          {/* Khối các cột nội dung */}
          <div className="grid flex-grow grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12 lg:max-w-[800px]">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3
                  className="text-base font-bold tracking-wide"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-xs font-normal text-white/80 transition-colors hover:text-white"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Cột Thông tin liên hệ */}
            <div>
              <h3
                className="text-base font-bold tracking-wide"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Thông tin liên hệ
              </h3>
              <ul className="mt-4 space-y-3">
                {contactItems.map((item) => (
                  <li key={item.label} className="flex items-start justify-center gap-3 sm:justify-start">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-white/90">
                      {item.icon}
                    </span>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-xs font-normal text-white/80 transition-colors hover:text-white break-all"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Đường kẻ ngang phân cách (Tùy chọn giúp sang trọng hơn) */}
        <hr className="my-8 border-white/10" />

        {/* Khối Copyright dưới cùng */}
        <div className="items-center gap-4 text-center text-xs font-medium text-white/60 sm:flex-row">
          <p style={{ fontFamily: 'Manrope, sans-serif' }}>
            © {new Date().getFullYear()} Vết Sử Việt. Lan tỏa sử ta
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;