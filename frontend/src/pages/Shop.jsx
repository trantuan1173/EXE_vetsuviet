import { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/Shop/ProductCard';
import Pagination from '../components/Common/Pagination';
import Loading from '../components/Common/Loading';
import { useNotification } from '../hooks/useNotification';
import heroBg from '../assets/Nen web 1.png';

const Shop = () => {
  const { error } = useNotification();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dynasties, setDynasties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    dynasty: false,
    battle: false,
    figure: false,
    artifact: false,
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dynasty: '',
    course: '',
    page: 1,
  });

  useEffect(() => {
    fetchCategories();
    fetchDynasties();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchDynasties = async () => {
    try {
      const response = await productService.getDynasties();
      setDynasties(response.data.data);
    } catch (err) {
      console.error('Failed to fetch dynasties');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await productService.getCourses();
      setCourses(response.data.data);
    } catch (err) {
      console.error('Failed to fetch courses');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (err) {
      error(err.response?.data?.message || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter submission logic here
    console.log('Newsletter email:', newsletterEmail);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e4' }}>
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          backgroundColor: '#6f0d0d',
          minHeight: '400px'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
        
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24">
          <div className="max-w-[900px]">
            {/* Subtitle */}
            <div className="mb-8">
              <span 
                className="text-xs font-bold tracking-wider"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#ffddaf',
                  letterSpacing: '2.4px',
                  lineHeight: '16px'
                }}
              >
                TRIỂN LÃM DI SẢN KỸ THUẬT SỐ
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="font-semibold mb-6 sm:mb-8 lg:mb-10"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                lineHeight: '1.25',
                color: '#ffffff',
                letterSpacing: '-1.28px'
              }}
            >
              Lịch sử không chỉ để đọc.<br />
              Lịch sử có thể được chạm vào.
            </h1>

            {/* Description */}
            <p 
              className="mb-4 sm:mb-6"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(14px, 2.5vw, 18px)',
                lineHeight: '1.6',
                color: '#e7e2dae5',
                paddingTop: '8px'
              }}
            >
              Khám phá bộ sưu tập mô hình và sản phẩm lịch sử giúp kiến thức trở nên trực quan
              và đáng nhớ hơn trong không gian triển lãm ảo cao cấp.
            </p>

            {/* CTA Button */}
            <div className="pt-4 sm:pt-6">
              <button 
              onClick={() => window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')}
                className="px-20 sm:px-20 py-3 sm:py-4 text-s font-bold tracking-wider text-[#601407] hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: '#FFD36E',
                  borderRadius: '5px',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '1.2px',
                  lineHeight: '16px',
                }}
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[275px_1fr] gap-6">
          {/* Sidebar Filter */}
          <aside className="lg:col-span-1">
            {/* Header Section */}
            <div className="mb-8" style={{ borderLeft: '4px solid #4b0003', paddingLeft: '24px' }}>
              <h2 
                className="font-medium mb-2" 
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '32px',
                  lineHeight: '40px',
                  color: '#4b0003'
                }}
              >
                Bộ lọc
              </h2>
              <p 
                className="text-base"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#57413f'
                }}
              >
                Tìm kiếm sản phẩm
              </p>
            </div>

            {/* Search and Category Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Input */}
              <div>
                <label 
                  className="block text-xs font-bold tracking-wider mb-2"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1d1c17',
                    letterSpacing: '1.2px'
                  }}
                >
                  TÌM KIẾM
                </label>
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-4 py-2 rounded"
                  style={{ 
                    border: '1px solid #e8e1d3',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '16px',
                    color: '#1d1c17'
                  }}
                />
              </div>

              {/* Category Select */}
              <div>
                <label 
                  className="block text-xs font-bold tracking-wider mb-2"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1d1c17',
                    letterSpacing: '1.2px'
                  }}
                >
                  DANH MỤC
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full px-4 py-2 rounded"
                  style={{ 
                    border: '1px solid #e8e1d3',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '16px',
                    color: '#1d1c17'
                  }}
                >
                  <option value="">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynasty Select */}
              <div>
                <label 
                  className="block text-xs font-bold tracking-wider mb-2"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1d1c17',
                    letterSpacing: '1.2px'
                  }}
                >
                  TRIỀU ĐẠI
                </label>
                <select
                  value={filters.dynasty}
                  onChange={(e) => handleFilterChange({ dynasty: e.target.value })}
                  className="w-full px-4 py-2 rounded"
                  style={{ 
                    border: '1px solid #e8e1d3',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '16px',
                    color: '#1d1c17'
                  }}
                >
                  <option value="">Tất cả</option>
                  {dynasties.map((dynasty) => (
                    <option key={dynasty} value={dynasty}>
                      {dynasty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Select */}
              <div>
                <label 
                  className="block text-xs font-bold tracking-wider mb-2"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1d1c17',
                    letterSpacing: '1.2px'
                  }}
                >
                  KHÓA HỌC
                </label>
                <select
                  value={filters.course}
                  onChange={(e) => handleFilterChange({ course: e.target.value })}
                  className="w-full px-4 py-2 rounded"
                  style={{ 
                    border: '1px solid #e8e1d3',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '16px',
                    color: '#1d1c17'
                  }}
                >
                  <option value="">Tất cả</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => handleFilterChange({ search: '', category: '', dynasty: '', course: '' })}
                className="w-full text-xs font-bold tracking-wider py-2 hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#4b0003',
                  letterSpacing: '1.2px',
                  border: '1px solid #4b0003',
                  borderRadius: '2px'
                }}
              >
                XÓA BỘ LỌC
              </button>
            </div>


            {/* Newsletter Box */}
            <div 
              className="rounded p-6"
              style={{ 
                backgroundColor: '#f2ede5',
                border: '1px solid #e8e1d3'
              }}
            >
              <svg width="29" height="24" viewBox="0 0 29 24" fill="none" className="mb-4">
                <path d="M14.5 0C11.5 0 9 2.5 9 5.5V10H7C5.3 10 4 11.3 4 13V21C4 22.7 5.3 24 7 24H22C23.7 24 25 22.7 25 21V13C25 11.3 23.7 10 22 10H20V5.5C20 2.5 17.5 0 14.5 0ZM14.5 2C16.4 2 18 3.6 18 5.5V10H11V5.5C11 3.6 12.6 2 14.5 2Z" fill="#7d5713"/>
              </svg>

              <h3 
                className="font-bold text-lg mb-2"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1d1c17',
                  lineHeight: '28px'
                }}
              >
                Đăng ký Hội Đồng Di Sản
              </h3>

              <p 
                className="text-base mb-4"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#57413f',
                  lineHeight: '24px'
                }}
              >
                Nhận thông tin sớm nhất về các mô hình giới hạn.
              </p>

              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded"
                  style={{ 
                    border: '1px solid #8b716e',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '16px'
                  }}
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#4b0003',
                    letterSpacing: '1.2px'
                  }}
                >
                  GỬI ĐI
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M10 0L8.6 1.4L12.2 5H0V7H12.2L8.6 10.6L10 12L16 6L10 0Z" fill="#4b0003"/>
                  </svg>
                </button>
              </form>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-1">
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p 
                  className="text-lg"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#57413f'
                  }}
                >
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Interactive Timeline Section */}
      <div 
        className="relative"
        style={{ 
          backgroundColor: '#0d0d0d',
          padding: '40px 16px 80px'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("/src/assets/Nen web 1.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />

        <div className="relative max-w-[840px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span 
                className="text-xs font-bold tracking-wider"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#ffddaf',
                  letterSpacing: '1.2px',
                  lineHeight: '16px'
                }}
              >
                DÒNG THỜI GIAN DI SẢN
              </span>
            </div>
            <h2 
              className="font-semibold"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(32px, 6vw, 64px)',
                lineHeight: '1.125',
                color: '#e7e2da',
                letterSpacing: '-1.28px'
              }}
            >
              Hành Trình Ngàn Năm
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative pt-[104px]">
            {/* Horizontal Line */}
            <div 
              className="absolute left-0 right-0"
              style={{ 
                height: '1px',
                backgroundColor: '#ffffff33',
                top: '148px'
              }}
            />

            {/* Timeline Nodes */}
            <div className="relative flex justify-between items-center" style={{ padding: '0 56px' }}>
              {/* Node 1 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full mb-4"
                  style={{ 
                    backgroundColor: '#7d5713',
                    border: '2px solid #ffddaf'
                  }}
                />
                <span 
                  className="text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#e7e2da',
                    letterSpacing: '1.2px'
                  }}
                >
                  938
                </span>
              </div>

              {/* Node 2 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full mb-4"
                  style={{ 
                    backgroundColor: '#7d5713',
                    border: '2px solid #ffddaf'
                  }}
                />
                <span 
                  className="text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#e7e2da',
                    letterSpacing: '1.2px'
                  }}
                >
                  1288
                </span>
              </div>

              {/* Node 3 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full mb-4"
                  style={{ 
                    backgroundColor: '#7d5713',
                    border: '2px solid #ffddaf'
                  }}
                />
                <span 
                  className="text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#e7e2da',
                    letterSpacing: '1.2px'
                  }}
                >
                  1428
                </span>
              </div>

              {/* Node 4 - Active/Larger */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-6 h-6 rounded-full mb-4"
                  style={{ 
                    backgroundColor: '#7d5713',
                    border: '3px solid #ffddaf',
                    marginTop: '-5px'
                  }}
                />
                <span 
                  className="text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#ffddaf',
                    letterSpacing: '1.2px'
                  }}
                >
                  1789
                </span>
              </div>

              {/* Node 5 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full mb-4"
                  style={{ 
                    backgroundColor: '#7d5713',
                    border: '2px solid #ffddaf'
                  }}
                />
                <span 
                  className="text-xs font-bold tracking-wider"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#e7e2da',
                    letterSpacing: '1.2px'
                  }}
                >
                  1945
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div 
        className="relative"
        style={{ 
          backgroundColor: '#1a1a1a',
          padding: '40px 16px 80px'
        }}
      >
        {/* Atmospheric particles effect can be added via CSS */}
        <div className="relative max-w-[840px] mx-auto px-4 sm:px-6">
          {/* Icon */}
          <div className="flex justify-center mb-10">
            <svg width="55" height="49" viewBox="0 0 55 49" fill="none">
              <path d="M13.75 0C6.15625 0 0 6.15625 0 13.75C0 21.3438 6.15625 27.5 13.75 27.5C15.8438 27.5 17.875 27.0312 19.6875 26.1875L13.75 49H27.5L33.4375 26.1875C35.25 27.0312 37.2812 27.5 39.375 27.5C46.9688 27.5 53.125 21.3438 53.125 13.75C53.125 6.15625 46.9688 0 39.375 0C35.0938 0 31.2812 2.03125 28.875 5.15625C26.4688 2.03125 22.6562 0 18.375 0H13.75Z" fill="#ffddaf"/>
            </svg>
          </div>

          {/* Quote */}
          <div className="mb-8">
            <p 
              className="text-center font-semibold italic"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(24px, 4vw, 48px)',
                lineHeight: '1.5',
                color: '#ffffff',
                letterSpacing: '-1.28px'
              }}
            >
              "Chúng tôi không chỉ tạo ra sản phẩm lịch sử. Chúng tôi tạo ra những dấu ấn để lịch sử được ghi nhớ lâu hơn."
            </p>
          </div>

          {/* Divider */}
          <div 
            className="mx-auto mb-8"
            style={{ 
              width: '96px',
              height: '4px',
              backgroundColor: '#7d5713'
            }}
          />

          {/* Attribution */}
          <div className="text-center pt-4">
            <p 
              className="font-light tracking-wider"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '18px',
                lineHeight: '28px',
                color: '#e7e2dab2',
                letterSpacing: '0.45px'
              }}
            >
              TRIẾT LÝ VẾT SỬ VIỆT • BẢN SẮC & DI SẢN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
