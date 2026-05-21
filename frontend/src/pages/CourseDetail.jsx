import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import ChapterTree from '../components/Course/ChapterTree';
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
  const [chapters, setChapters] = useState([]);
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
      setChapters(response.data.data.chapters);
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
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            ← Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-200 aspect-video">
              <img
                src={course.thumbnail || 'https://placehold.co/800x450/DC2626/FFFFFF?text=VSV'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
                  {course.dynasty}
                </span>
                <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded">
                  {difficultyLabels[course.difficulty]}
                </span>
              </div>

              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">
                {course.title}
              </h1>

              <p className="text-gray-600 text-lg mb-4">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>👥 {course.enrolledCount || 0} học viên</span>
                <span>📚 {chapters.length} chương</span>
                <span>
                  📖{' '}
                  {chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)} bài
                  học
                </span>
              </div>
            </div>

            {/* Chapters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Nội dung khóa học
              </h2>
              <ChapterTree chapters={chapters} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Bắt đầu học ngay</p>
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  size="lg"
                  className="w-full"
                >
                  {enrolling ? 'Đang ghi danh...' : 'Ghi danh khóa học'}
                </Button>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Truy cập vĩnh viễn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Kiếm XP & Level up</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Quiz tương tác</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
