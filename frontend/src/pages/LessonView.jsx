import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import courseService from '../services/courseService';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      setLesson(response.data.data);
    } catch (err) {
      error('Không thể tải bài học');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson) return;

    setCompleting(true);
    try {
      await courseService.completeLesson(lesson.courseId, lessonId);
      success('Bài học đã được đánh dấu hoàn thành!');
    } catch (err) {
      error(err.response?.data?.message || 'Không thể hoàn thành bài học');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loading fullPage />;
  if (!lesson) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/courses/${lesson.courseId}`)}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            ← Quay lại khóa học
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {lesson.videoUrl ? (
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={lesson.videoUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="mb-6 rounded-xl overflow-hidden bg-gray-200 aspect-video flex items-center justify-center">
                <p className="text-gray-500">Không có video cho bài học này</p>
              </div>
            )}

            {/* Lesson Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">
                Chương: <span className="font-medium">{lesson.chapterId?.title}</span>
              </p>

              {lesson.duration > 0 && (
                <p className="text-sm text-gray-500">
                  ⏱ Thời lượng: {Math.floor(lesson.duration / 60)} phút
                </p>
              )}

              {lesson.content && (
                <div className="mt-6 prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleCompleteLesson} disabled={completing} size="lg">
                {completing ? 'Đang xử lý...' : '✓ Đánh dấu hoàn thành'}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate(`/quiz/lesson/${lessonId}`)}>
                ❓ Làm bài quiz
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">
                Thông tin bài học
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Trạng thái</p>
                  <p className="text-green-600">✓ Đã hoàn thành</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bước tiếp theo</p>
                  <p>Làm bài quiz để kiếm XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
