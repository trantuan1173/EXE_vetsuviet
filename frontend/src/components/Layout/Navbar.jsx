import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import searchService from '../../services/searchService';
import logoIcon from '../../assets/Logo 3 1.png';
import logoText from '../../assets/Logo text 3 1.png';

const navItems = [
  { to: '/', label: 'Trang chủ' },
  { to: '/courses', label: 'Khóa học' },
  { to: '/shop', label: 'Sản phẩm' },
  { to: '/about', label: 'Về chúng tôi' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ courses: [], products: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const navClassName = isHomePage
    ? 'absolute top-0 left-0 right-0 z-40 bg-transparent'
    : 'sticky top-0 z-40 bg-[#6F0D0D]';

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to.includes('#')) return false;
    return location.pathname.startsWith(to);
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close menus when navigating
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setQuery('');
    setResults({ courses: [], products: [] });
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const doSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setResults({ courses: [], products: [] });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await searchService.globalSearch(q.trim());
      const data = res.data?.data || res.data || {};
      setResults({
        courses: data.courses || [],
        products: data.products || [],
      });
    } catch {
      setResults({ courses: [], products: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setQuery('');
      setResults({ courses: [], products: [] });
    }
  };

  const hasResults = results.courses.length > 0 || results.products.length > 0;
  const showDropdown = searchOpen && (query.length >= 2 || loading);

  return (
    <nav className={navClassName}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] sm:min-h-[80px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 z-50">
            <img src={logoIcon} alt="Vết Sử Việt Logo" className="h-12 sm:h-16 lg:h-[78px] w-auto" />
            <img src={logoText} alt="Vết Sử Việt" className="h-8 sm:h-10 lg:h-[51px] w-auto hidden xs:block" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`relative pb-1 font-['Hepta_Slab'] text-[15px] font-bold tracking-[-0.02em] transition-colors ${
                    active ? 'text-[#FFD36E]' : 'text-white hover:text-[#FFD36E]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 block h-px w-[61px] bg-[#FFD36E]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 z-50">
            {/* Search button */}
            <div ref={searchRef} className="relative">
              <button
                onClick={toggleSearch}
                className="text-white hover:text-[#FFD36E] transition-colors p-1.5 sm:p-1"
                aria-label="Tìm kiếm"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] z-50">
                  {/* Search input */}
                  <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <svg
                      className="w-5 h-5 ml-3 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      placeholder="Tìm khóa học, sản phẩm..."
                      className="w-full px-3 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                    {query && (
                      <button
                        onClick={() => {
                          setQuery('');
                          setResults({ courses: [], products: [] });
                          inputRef.current?.focus();
                        }}
                        className="pr-3 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Results dropdown */}
                  {showDropdown && (
                    <div className="mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                      {loading && (
                        <div className="flex items-center justify-center py-6 text-gray-400 text-sm">
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Đang tìm kiếm...
                        </div>
                      )}

                      {!loading && !hasResults && query.length >= 2 && (
                        <div className="py-6 text-center text-gray-400 text-sm">
                          Không tìm thấy kết quả cho "{query}"
                        </div>
                      )}

                      {!loading && results.courses.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-bold text-[#6F0D0D] uppercase tracking-wider bg-gray-50 border-b">
                            Khóa học
                          </div>
                          {results.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => {
                                navigate(`/courses/${course._id}`);
                                setSearchOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF7E4] transition-colors text-left border-b border-gray-100 last:border-0"
                            >
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-10 h-10 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-[#6F0D0D]/10 flex items-center justify-center shrink-0">
                                  <span className="text-lg">📚</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{course.title}</p>
                                <p className="text-xs text-gray-500">
                                  {course.dynasty && <span>{course.dynasty} · </span>}
                                  {course.difficulty && <span className="capitalize">{course.difficulty}</span>}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {!loading && results.products.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-bold text-[#6F0D0D] uppercase tracking-wider bg-gray-50 border-b">
                            Sản phẩm
                          </div>
                          {results.products.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => {
                                navigate('/shop');
                                setSearchOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF7E4] transition-colors text-left border-b border-gray-100 last:border-0"
                            >
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-[#FFD36E]/20 flex items-center justify-center shrink-0">
                                  <span className="text-lg">🛍️</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {product.price?.toLocaleString('vi-VN')}đ
                                  {product.category && <span> · {product.category}</span>}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 md:gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-white hover:text-[#FFD36E] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#FFD36E]/20 flex items-center justify-center">
                    <span className="font-semibold text-sm text-white">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium max-w-[140px] truncate">{user?.fullName}</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm bg-[#FFD36E] text-[#601407] px-3 py-1.5 rounded-[7px] hover:opacity-90 font-bold"
                  >
                    Admin
                  </Link>
                )}

                <button onClick={logout} className="hidden md:block text-sm text-white/90 hover:text-red-200">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="w-20 sm:w-[124px] h-[34px] sm:h-[38px] rounded-[7px] border border-[#FFD36E] flex items-center justify-center text-white font-['Hepta_Slab'] text-sm sm:text-[15px] font-bold tracking-[-0.02em] hover:bg-white/10"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="w-20 sm:w-[124px] h-[34px] sm:h-[38px] rounded-[7px] bg-[#FFD36E] flex items-center justify-center text-[#601407] font-['Hepta_Slab'] text-sm sm:text-[15px] font-bold tracking-[-0.02em] hover:opacity-95"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-[#FFD36E] transition-colors p-1.5"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#6F0D0D] z-50 lg:hidden shadow-2xl animate-slide-in overflow-y-auto">
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* User info (if authenticated) */}
              {isAuthenticated && (
                <div className="mb-6 pb-6 border-b border-white/20">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-white hover:text-[#FFD36E] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FFD36E]/20 flex items-center justify-center">
                      <span className="font-semibold text-lg text-white">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user?.fullName}</p>
                      <p className="text-xs text-white/70">Xem hồ sơ</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Navigation items */}
              <nav className="space-y-1 mb-6">
                {navItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-['Hepta_Slab'] font-bold transition-colors ${
                        active
                          ? 'bg-[#FFD36E] text-[#601407]'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Auth buttons or actions */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-[#FFD36E] text-[#601407] px-4 py-3 rounded-lg font-bold hover:opacity-90"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center border-2 border-white/30 text-white px-4 py-3 rounded-lg font-bold hover:bg-white/10"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-[#FFD36E] text-[#601407] px-4 py-3 rounded-lg font-['Hepta_Slab'] font-bold hover:opacity-95"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center border-2 border-[#FFD36E] text-white px-4 py-3 rounded-lg font-['Hepta_Slab'] font-bold hover:bg-white/10"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;