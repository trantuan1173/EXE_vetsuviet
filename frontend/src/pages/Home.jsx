import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroBg from '../assets/Nen web 1.png';
import courseService from '../services/courseService';

const featureCards = [
  {
    title: 'Học sử thú vị',
    description: 'Khám phá lịch sử Việt Nam qua những câu chuyện, nhân vật và sự kiện được kể lại một cách sinh động, dễ hiểu.',
    cta: 'Khám phá ngay',
    icon: '📚',
  },
  {
    title: 'Khám phá thêm',
    description: 'Chiêm ngưỡng hình ảnh, hiện vật và những dấu ấn lịch sử giúp bạn hiểu sâu hơn về quá khứ dân tộc.',
    cta: '',
    icon: '🔍',
  },
  {
    title: 'Tham gia cộng đồng',
    description:
      'Kết nối với những người yêu lịch sử, cùng chia sẻ kiến thức, thảo luận và lan tỏa giá trị văn hóa dân tộc.',
    cta: 'Tham gia ngay',
    icon: '🤝',
  },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getRandomCourses(3);
        setCourses(response.data.data.courses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching random courses:', err);
        setError('Không thể tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomCourses();
  }, []);

  return (
    <div className="bg-[#FFF7E4] text-[#111827]">
      <section
        className="relative min-h-[500px] sm:min-h-[650px] lg:min-h-[815px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
          <div className="pt-24 sm:pt-32 md:pt-40 lg:pt-52 max-w-[680px]">
            <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-[56px]">
              Hành trình qua những
              <br />
              cột mốc vàng son
            </h1>
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-[7px] bg-[#FFD36E] px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 text-[#601407] text-lg sm:text-xl lg:text-2xl font-medium hover:opacity-90 transition-opacity"
              >
                Bắt đầu học ngay
              </Link>
            </div>
            <p className="mt-4 sm:mt-5 text-white text-base sm:text-lg md:text-xl">
              Hơn 1000+ <span className="text-[#FFD36E] font-bold">học viên đã tham gia</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-10 relative z-20">
        {featureCards.map((item) => {
          const cardContent = (
            <>
              <div className="mx-auto mb-4 sm:mb-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#6F0D0D]/10 flex items-center justify-center text-2xl sm:text-3xl">
                {item.icon}
              </div>
              <h3 className="text-lg sm:text-[20px] leading-6 sm:leading-7 font-bold mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-[#4B5563] text-sm sm:text-[16px] leading-5 sm:leading-6 mb-3 sm:mb-4">{item.description}</p>
              {item.cta && <span className="text-[#6F0D0D] font-bold text-[16px]">{item.cta}</span>}
            </>
          );

          if (item.title === 'Học sử thú vị') {
            return (
              <Link
                key={item.title}
                to="/courses"
                className="rounded-xl border-b-4 border-[#6F0D0D] bg-white p-8 text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow"
              >
                {cardContent}
              </Link>
            );
          }

          if (item.title === 'Tham gia cộng đồng') {
            return (
              <div
                key={item.title}
                className="rounded-xl border-b-4 border-[#6F0D0D] bg-white p-8 text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')}
              >
                {cardContent}
              </div>
            );
          }

          return (
            <div
              key={item.title}
              className="rounded-xl border-b-4 border-[#6F0D0D] bg-white p-8 text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
            >
              {cardContent}
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-[#6F0D0D] font-bold tracking-[0.1em] text-xs sm:text-sm">KHÁM PHÁ</span>
              <span className="h-px w-8 sm:w-12 bg-[#6F0D0D]" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Các khóa học lịch sử Việt Nam</h2>
            <p className="text-[#4B5563] text-base sm:text-lg leading-6 sm:leading-7">
              Hệ thống khóa học được biên soạn theo từng giai đoạn lịch sử, bám sát chương trình và mở rộng kiến
              thức.
            </p>
          </div>
          <Link
            to="/courses"
            className="self-start lg:self-auto border-2 border-[#6F0D0D] text-[#6F0D0D] font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded text-sm sm:text-base hover:bg-[#6F0D0D] hover:text-white transition-colors"
          >
            Xem tất cả khóa học
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6F0D0D] border-r-transparent"></div>
            <p className="mt-4 text-[#4B5563] text-sm sm:text-base">Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-[#4B5563] text-sm sm:text-base">Chưa có khóa học nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="rounded-xl border border-[#DED9D2] bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="h-40 sm:h-48 w-full object-cover" />
                ) : (
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-[#6F0D0D] to-[#D4AF37]" />
                )}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-[#6B7280] text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2">{course.description || 'Khóa học lịch sử Việt Nam'}</p>
                  <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                    <span>{course.dynasty || 'Lịch sử'}</span>
                    <span>{course.difficulty || 'Trung bình'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* <section className="mx-auto max-w-[1232px] px-4 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl bg-[#6F0D0D] px-6 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 text-white flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 sm:mb-4">
              Tham gia thử thách – Tích điểm
              <br />– Nhận phần thưởng
            </h3>
            <p className="text-white/90 text-base sm:text-lg leading-6 sm:leading-7">
              Kiểm tra kiến thức qua quiz, sự kiện hấp dẫn và nhận những phần quà độc quyền từ Vết Sử Việt.
            </p>
          </div>
          <button className="bg-[#FFD36E] text-[#6F0D0D] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base hover:opacity-90 transition-opacity w-full lg:w-auto">Tham gia ngay</button>
        </div>
      </section> */}

      <section id="community" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-8 sm:gap-12">
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="text-[#6F0D0D] font-bold tracking-[0.1em] text-xs sm:text-sm">CỘNG ĐỒNG</span>
            <span className="h-px w-8 sm:w-12 bg-[#6F0D0D]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-5">
            Cùng nhau lan
            <br />
            tỏa tình yêu
            <br />
            lịch sử
          </h2>
          <p className="text-[#4B5563] text-sm sm:text-base leading-6 sm:leading-7 mb-5 sm:mb-7">
            Tham gia cộng đồng Vết Sử Việt để thảo luận, chia sẻ kiến thức và kết nối với những người cùng đam mê lịch
            sử dân tộc.
          </p>
          <button
          onClick={() => window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')}
           className="border-2 border-[#6F0D0D] text-[#6F0D0D] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base hover:bg-[#6F0D0D] hover:text-white transition-colors w-full lg:w-auto">
            Tham gia cộng đồng
          </button>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-[#6F0D0D]/10 bg-[#6F0D0D]/5 p-6 sm:p-8 md:p-10">
          <p className="text-[#6F0D0D] font-bold text-base sm:text-lg mb-3 sm:mb-4">+1.2K thành viên mới tuần này</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#6F0D0D] mb-3 sm:mb-4">Cộng đồng Vết Sử Việt</h3>
          <p className="text-[#374151] text-sm sm:text-base mb-5 sm:mb-6">
            Nơi giao lưu, học hỏi và chia sẻ kiến thức lịch sử cùng hàng nghìn thành viên.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-[#1F2937] text-sm sm:text-base">
            <li>• Thảo luận sôi nổi mỗi ngày</li>
            <li>• Sự kiện cộng đồng hấp dẫn</li>
            <li>• Chia sẻ tài liệu, nguồn học liệu giá trị</li>
          </ul>
        </div>
      </section>

    </div>
  );
};

export default Home;