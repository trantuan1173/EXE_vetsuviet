import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../services/courseService';
import productService from '../services/productService';
import Loading from '../components/Common/Loading';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, error } = useNotification();

  const [course, setCourse] = useState(null);
  const [products, setProducts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
    fetchProducts();
    fetchLeaderboard();
  }, [id]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await productService.getProductsByCourse(id, 3);
      setProducts(response.data.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseDetail(id);
      setCourse(response.data.data.course);
    } catch (err) {
      error(err.response?.data?.message || 'Không thể tải khóa học');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const response = await courseService.getCourseLeaderboard(id, 5);
      setLeaderboard(response.data.data.leaderboard || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await courseService.enrollCourse(id);
      success('Ghi danh khóa học thành công!');
      navigate(`/courses/${id}/learn`);
      // window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')
    } catch (err) {
      if (err.response?.data?.message === 'Already enrolled in this course') {
        navigate(`/courses/${id}/learn`);
        return;
      }
      error(err.response?.data?.message || 'Ghi danh thất bại');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePurchase = () => {
  handleEnroll()
    .then(() => {
      window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank');
    })
    .catch((error) => {
      console.error("Lỗi đăng ký:", error);
    });
};

  if (loading) return <Loading fullPage />;
  if (!course) return null;

  return (
    <div className="bg-[#FFF7E4] min-h-screen pt-10">

      <div className="max-w-[1366px] mx-auto px-9 ">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/courses" className="text-[#6F0D0D] text-sm font-bold tracking-[0.05em]">
            Khoá học
          </Link>
          <svg width="4" height="7" viewBox="0 0 4 7" fill="none" className="mx-2">
            <path d="M0.5 0.5L3.5 3.5L0.5 6.5" stroke="#6F0D0D" strokeLinecap="round" />
          </svg>
          <span className="text-[#6F0D0D] text-sm font-bold tracking-[0.05em]">
            {course.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[970px_341px] gap-8">
          {/* Left Column */}
          <div className="space-y-8 pb-20">
            {/* Hero Section */}
            <div className="rounded-2xl p-16 relative overflow-hidden">
              {/* Background Image with Opacity */}
              {course.thumbnail && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-50"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                />
              )}
              {/* White overlay for better text readability */}
              <div className="absolute inset-0 bg-white/30" />
              
              <div className="relative z-10">
                {/* Dynasty Badge */}
                <div className="inline-flex items-center bg-[#FFDDAF] rounded-full px-3 py-1 mb-2">
                  <span className="text-[#6F0D0D] text-sm font-semibold tracking-[0.05em]">
                    {course.dynasty || 'Thời Trần'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-[#6F0D0D] text-5xl font-semibold leading-[52.8px] tracking-[-0.02em] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {course.title.toUpperCase()}
                </h1>

                {/* Description */}
                <p className="text-[#6F0D0D] text-base leading-6 mb-4 max-w-[448px]">
                  {course.description || 'Description'}
                </p>

                <div className="text-[#6F0D0D] text-3xl font-bold mb-8">
                  {(course.price || 0).toLocaleString('vi-VN')}đ
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="bg-white text-[#7C0000] font-normal text-base px-8 py-3 rounded-lg shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow"
                  >
                    Tiếp tục học
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={enrolling}
                    className="bg-[#FFDDAF] text-[#7C0000] font-normal text-base px-8 py-3 rounded-lg shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    {enrolling ? 'Đang xử lý...' : 'Mua ngay'}
                  </button>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2.83 8.5L6.75 12.42L14.17 5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-black text-sm leading-6">Truy cập vĩnh viễn</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2.83 8.5L6.75 12.42L14.17 5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-black text-sm leading-6">Lý thuyết + Video</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2.83 8.5L6.75 12.42L14.17 5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-black text-sm leading-6">Quiz tương tác</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Leaderboard Section */}
            <div className="bg-[rgba(255,210,105,0.7)] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(111,13,13,0.08)]">
              {/* Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-[rgba(222,191,188,0.3)] mb-6">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                  <path d="M10 0L12.245 6.755L19 9L12.245 11.245L10 18L7.755 11.245L1 9L7.755 6.755L10 0Z" fill="#4B0003" />
                </svg>
                <h2 className="text-[#281713] text-2xl font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  BẢNG XẾP HẠNG
                </h2>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-4">
                {leaderboardLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#6F0D0D] border-t-transparent"></div>
                  </div>
                ) : leaderboard.length > 0 ? (
                  leaderboard.map((user) => {
                    const isTopRank = user.rank === 1;
                    const displayName = user.name || 'Học viên';
                    const avatar =
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6F0D0D&color=fff`;

                    return (
                  <div
                    key={user.userId || user.rank}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isTopRank ? 'bg-[#FFF1ED]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="w-6">
                        <span className={`text-base font-bold ${isTopRank ? 'text-[#4B0003]' : 'text-[#57413F]'}`}>
                          {user.rank}
                        </span>
                      </div>

                      {/* Avatar */}
                      <img
                        src={avatar}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      {/* Name & Level */}
                      <div>
                        <div className={`text-sm leading-5 ${isTopRank ? 'font-normal' : 'font-normal'}`}>
                          {displayName}
                        </div>
                        <div className="text-[#57413F] text-[10px] leading-[15px]">
                          Cấp {user.level || 1} · {user.completedQuizzes || 0} quiz
                        </div>
                      </div>
                    </div>

                    {/* XP */}
                    <div className={`text-base font-semibold ${isTopRank ? 'text-[#4B0003]' : 'text-[#57413F]'}`}>
                      {(user.xp || 0).toLocaleString('vi-VN')} XP
                    </div>
                  </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-[#57413F]">
                    Chưa có dữ liệu xếp hạng
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Products Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#6F0D0D]">Sản phẩm liên quan</h2>
              
              {productsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#6F0D0D] border-t-transparent"></div>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_0_rgba(111,13,13,0.08)] border border-[#DED9D2]"
                  >
                    {/* Product Image */}
                    <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={product.images?.[0]?.url || 'https://placehold.co/300x300/6F0D0D/FFFFFF?text=Product'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-[#4B0003] mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Product Description */}
                    {product.description && (
                      <p className="text-sm text-[#57413F] mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="text-2xl font-bold text-[#D8A85D] mb-4">
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={() => window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')}
                      className="w-full bg-[#D8A85D] text-white font-bold text-base px-6 py-3 rounded-lg shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-lg hover:bg-[#c99a4d] transition-all"
                    >
                      Mua ngay
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#57413F]">
                  Chưa có sản phẩm liên quan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
