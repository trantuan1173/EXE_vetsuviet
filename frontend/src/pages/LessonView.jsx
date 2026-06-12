import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { useNotification } from '../hooks/useNotification';

const LessonView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [course, setCourse] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [videoMessage, setVideoMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isMindmapOpen, setIsMindmapOpen] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseDetail(courseId);
      const courseData = response.data.data.course;
      setCourse(courseData);
      setPlaybackUrl('');
      setVideoMessage('');

      if (courseData.videoKey || courseData.videoUrl?.includes('/video/playback')) {
        try {
          const playbackResponse = await courseService.getCoursePlaybackUrl(courseId);
          setPlaybackUrl(playbackResponse.data.data.playbackUrl);
        } catch (playbackErr) {
          if (playbackErr.response?.status === 401) {
            error('Bạn cần đăng nhập để xem video khóa học');
            navigate('/login');
            return;
          }

          setVideoMessage(playbackErr.response?.data?.message || 'Vui lòng mua khoá học để xem video');
        }
      } else {
        setPlaybackUrl(courseData.videoUrl || '');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        error('Bạn cần đăng nhập để xem video khóa học');
        navigate('/login');
        return;
      }
      error(err.response?.data?.message || 'Không thể tải khóa học');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async () => {
    if (!course) return;

    setCompleting(true);
    try {
      await courseService.completeCourse(courseId);
      success('Khóa học đã được đánh dấu hoàn thành!');
    } catch (err) {
      error(err.response?.data?.message || 'Không thể hoàn thành khóa học');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loading fullPage />;
  if (!course) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate(`/courses/${courseId}`)} className="text-primary-600 hover:text-primary-700 font-medium mb-4">
            ← Quay lại khóa học
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {playbackUrl ? (
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  controls
                  src={playbackUrl}
                  title={course.title}
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            ) : (
              <div className="mb-6 rounded-xl overflow-hidden bg-gray-200 aspect-video flex items-center justify-center p-6 text-center">
                <div>
                  <p className="font-semibold text-gray-700">
                    {videoMessage || 'Không có video cho khóa học này'}
                  </p>
                  {videoMessage && (
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
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{course.title}</h1>
              {course.duration > 0 && <p className="text-sm text-gray-500 mb-4">⏱ Thời lượng: {course.duration} phút</p>}

              {course.content ? (
                <div
                  className="mt-6 prose prose-sm max-w-none text-gray-700 leading-7"
                  dangerouslySetInnerHTML={{ __html: course.content }}
                />
              ) : (
                <p className="text-gray-500 mt-6">Khóa học chưa có nội dung lý thuyết.</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCompleteCourse} disabled={completing} size="lg">
                {completing ? 'Đang xử lý...' : '✓ Đánh dấu hoàn thành'}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate(`/quiz/course/${courseId}`)}>
                ❓ Làm bài quiz
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Thông tin khóa học</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Trạng thái</p>
                  <p>{videoMessage ? 'Học lý thuyết và làm quiz. Video chờ admin xác nhận thanh toán.' : 'Học lý thuyết, xem video và làm quiz'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bước tiếp theo</p>
                  <p>Làm bài quiz để kiếm XP</p>
                </div>
              </div>
            </div>

            {/* {course.mindmapImage && (
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_0_rgba(111,13,13,0.08)]">
                <div className="flex items-center gap-2 pb-4 border-b border-[rgba(222,191,188,0.3)] mb-6">
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                    <path d="M10 0L12.245 6.755L19 9L12.245 11.245L10 18L7.755 11.245L1 9L7.755 6.755L10 0Z" fill="#4B0003" />
                  </svg>
                  <h5 className="text-[#281713]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MINDMAP KHOÁ HỌC
                  </h5>
                </div>
                <a href={course.mindmapImage} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={course.mindmapImage}
                    alt={`Mindmap ${course.title}`}
                    className="w-full rounded-xl border border-[#DEBFBC]/30 object-contain bg-[#FFF7E4]"
                  />
                </a>
              </div>
            )} */}
            {/* Phần hiển thị thumbnail Mindmap */}
            {course.mindmapImage && (
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_0_rgba(111,13,13,0.08)]">
                <div className="flex items-center gap-2 pb-4 border-b border-[rgba(222,191,188,0.3)] mb-6">
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                    <path d="M10 0L12.245 6.755L19 9L12.245 11.245L10 18L7.755 11.245L1 9L7.755 6.755L10 0Z" fill="#4B0003" />
                  </svg>
                  <h5 className="text-[#281713]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MINDMAP KHOÁ HỌC
                  </h5>
                </div>

                {/* Thay thẻ <a> bằng thẻ <img> có sự kiện onClick */}
                <img
                  src={course.mindmapImage}
                  alt={`Mindmap ${course.title}`}
                  className="w-full rounded-xl border border-[#DEBFBC]/30 object-contain bg-[#FFF7E4] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsMindmapOpen(true)}
                />
              </div>
            )}

            {/* Modal Popup hiển thị ảnh */}
            {isMindmapOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsMindmapOpen(false)}
              >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex justify-center">
                  <button
                    className="absolute -top-10 right-0 text-white font-bold hover:text-gray-300"
                    onClick={() => setIsMindmapOpen(false)}
                  >
                    Đóng (X)
                  </button>
                  <img
                    src={course.mindmapImage}
                    alt="Mindmap Preview"
                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click vào ảnh
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
