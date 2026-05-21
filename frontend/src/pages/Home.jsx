import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Khám phá Lịch sử Việt Nam
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Học lịch sử qua quiz tương tác, kiếm XP, lên cấp và khám phá
              các vật phẩm lịch sử tại cửa hàng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button variant="gold" size="lg">
                  Bắt đầu học ngay
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Khám phá cửa hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-gray-800">
            Tại sao chọn Vết Sử Việt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Khóa học theo Triều đại</h3>
              <p className="text-gray-600">
                Nội dung được hệ thống theo từng triều đại lịch sử Việt Nam, từ
                Hùng Vương đến Nguyễn.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Quiz tương tác</h3>
              <p className="text-gray-600">
                Kiểm tra kiến thức qua các bài quiz hấp dẫn với bộ đếm thời
                gian và chấm điểm tức thì.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Gamification (XP/Level)</h3>
              <p className="text-gray-600">
                Kiếm XP qua quiz, lên level và theo dõi tiến trình học tập
                của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4 text-gray-800">
            Sẵn sàng khám phá lịch sử?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Tham gia cùng hàng ngàn người học và bắt đầu hành trình của bạn ngay hôm nay.
          </p>
          <Link to="/register">
            <Button size="lg">Đăng ký miễn phí</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
