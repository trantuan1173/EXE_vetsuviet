import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroBg from '../assets/Nen web 1.png';
import courseService from '../services/courseService';

const featureCards = [
  {
    title: 'Học sử thú vị',
    description: 'Bài học sinh động, dễ hiểu theo từng giai đoạn lịch sử.',
    cta: 'Khám phá ngay',
    icon: '📚',
  },
  {
    title: 'Khám phá thêm',
    description: 'Được nhìn, chiêm ngưỡng những điều thú vị',
    cta: '',
    icon: '🔍',
  },
  {
    title: 'Tham gia cộng đồng',
    description:
      'Tham gia cộng đồng Vết Sử Việt để thảo luận, chia sẻ kiến thức và kết nối với những người cùng đam mê lịch sử dân tộc.',
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
        className="relative min-h-[815px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-10 pt-8">
          <div className="pt-40 md:pt-52 max-w-[680px]">
            <h1 className="text-white font-bold leading-tight text-4xl md:text-5xl lg:text-[56px]">
              Hành trình qua những
              <br />
              cột mốc vàng son
            </h1>
            <div className="mt-10">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-[7px] bg-[#FFD36E] px-10 py-4 text-[#601407] text-2xl font-medium"
              >
                Bắt đầu học ngay
              </Link>
            </div>
            <p className="mt-5 text-[#111827] text-lg md:text-xl">
              Hơn 1000+ <span className="text-[#FFD36E] font-bold">học viên đã tham gia</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10 relative z-20">
        {featureCards.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border-b-4 border-[#6F0D0D] bg-white p-8 text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
          >
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-[#6F0D0D]/10 flex items-center justify-center text-3xl">
              {item.icon}
            </div>
            <h3 className="text-[20px] leading-7 font-bold mb-3">{item.title}</h3>
            <p className="text-[#4B5563] text-[16px] leading-6 mb-4">{item.description}</p>
            {item.cta && <span className="text-[#6F0D0D] font-bold text-[16px]">{item.cta}</span>}
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#6F0D0D] font-bold tracking-[0.1em] text-sm">KHÁM PHÁ</span>
              <span className="h-px w-12 bg-[#6F0D0D]" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Các khóa học lịch sử Việt Nam</h2>
            <p className="text-[#4B5563] text-lg leading-7">
              Hệ thống khóa học được biên soạn theo từng giai đoạn lịch sử, bám sát chương trình và mở rộng kiến
              thức.
            </p>
          </div>
          <Link
            to="/courses"
            className="self-start lg:self-auto border-2 border-[#6F0D0D] text-[#6F0D0D] font-bold px-8 py-3 rounded"
          >
            Xem tất cả khóa học
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6F0D0D] border-r-transparent"></div>
            <p className="mt-4 text-[#4B5563]">Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4B5563]">Chưa có khóa học nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="rounded-xl border border-[#DED9D2] bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#6F0D0D] to-[#D4AF37]" />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-[#6B7280] mb-5 line-clamp-2">{course.description || 'Khóa học lịch sử Việt Nam'}</p>
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

      <section className="mx-auto max-w-[1232px] px-6">
        <div className="rounded-2xl bg-[#6F0D0D] px-8 md:px-12 py-10 md:py-12 text-white flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Tham gia thử thách – Tích điểm
              <br />– Nhận phần thưởng
            </h3>
            <p className="text-white/90 text-lg leading-7">
              Kiểm tra kiến thức qua quiz, sự kiện hấp dẫn và nhận những phần quà độc quyền từ Vết Sử Việt.
            </p>
          </div>
          <button className="bg-[#FFD36E] text-[#6F0D0D] font-bold px-8 py-4 rounded-lg">Tham gia ngay</button>
        </div>
      </section>

      <section id="community" className="mx-auto max-w-[1280px] px-6 py-20 grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#6F0D0D] font-bold tracking-[0.1em] text-sm">CỘNG ĐỒNG</span>
            <span className="h-px w-12 bg-[#6F0D0D]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Cùng nhau lan
            <br />
            tỏa tình yêu
            <br />
            lịch sử
          </h2>
          <p className="text-[#4B5563] leading-7 mb-7">
            Tham gia cộng đồng Vết Sử Việt để thảo luận, chia sẻ kiến thức và kết nối với những người cùng đam mê lịch
            sử dân tộc.
          </p>
          <button className="border-2 border-[#6F0D0D] text-[#6F0D0D] font-bold px-8 py-4 rounded-lg">
            Tham gia cộng đồng
          </button>
        </div>

        <div className="rounded-3xl border border-[#6F0D0D]/10 bg-[#6F0D0D]/5 p-8 md:p-10">
          <p className="text-[#6F0D0D] font-bold text-lg mb-4">+1.2K thành viên mới tuần này</p>
          <h3 className="text-3xl font-bold text-[#6F0D0D] mb-4">Cộng đồng Vết Sử Việt</h3>
          <p className="text-[#374151] mb-6">
            Nơi giao lưu, học hỏi và chia sẻ kiến thức lịch sử cùng hàng nghìn thành viên.
          </p>
          <ul className="space-y-3 text-[#1F2937]">
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