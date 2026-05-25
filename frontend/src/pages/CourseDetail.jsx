import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, error } = useNotification();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

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

  if (loading) return <Loading fullPage />;
  if (!course) return null;

  const difficultyLabels = {
    basic: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => navigate('/courses')} className="text-primary-600 hover:text-primary-700 font-medium mb-4">
            ← Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-200 aspect-video">
              <img
                src={course.thumbnail || 'https://placehold.co/800x450/DC2626/FFFFFF?text=VSV'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
                  {course.dynasty}
                </span>
                <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded">
                  {difficultyLabels[course.difficulty]}
                </span>
              </div>

              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">{course.title}</h1>
              <p className="text-gray-600 text-lg mb-4">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>👥 {course.enrolledCount || 0} học viên</span>
                {course.duration > 0 && <span>⏱ {course.duration} phút</span>}
                <span>❓ Quiz tương tác</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Nội dung khóa học</h2>
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Phần lý thuyết</h3>
                  <p className="text-gray-600 text-sm">
                    {course.content ? 'Đọc nội dung lý thuyết chi tiết của khóa học.' : 'Khóa học chưa có nội dung lý thuyết.'}
                  </p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Video bài học</h3>
                  <p className="text-gray-600 text-sm">
                    {course.videoUrl ? 'Xem video minh họa và bài giảng.' : 'Khóa học chưa có video.'}
                  </p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Quiz kiểm tra</h3>
                  <p className="text-gray-600 text-sm">Làm bài quiz sau khi học xong để nhận XP.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Bắt đầu học ngay</p>
                <Button onClick={handleEnroll} disabled={enrolling} size="lg" className="w-full">
                  {enrolling ? 'Đang xử lý...' : 'Vào học'}
                </Button>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><span>✓</span><span>Truy cập vĩnh viễn</span></div>
                <div className="flex items-center gap-2"><span>✓</span><span>Lý thuyết + video</span></div>
                <div className="flex items-center gap-2"><span>✓</span><span>Quiz tương tác</span></div>
                <div className="flex items-center gap-2"><span>✓</span><span>Kiếm XP & Level up</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
