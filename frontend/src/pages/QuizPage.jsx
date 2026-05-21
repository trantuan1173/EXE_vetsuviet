import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
import QuizTimer from '../components/Quiz/QuizTimer';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizResult from '../components/Quiz/QuizResult';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { useNotification } from '../hooks/useNotification';

const QuizPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { error } = useNotification();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizByLesson(lessonId);
      setQuiz(response.data.data.quiz);
      setQuestions(response.data.data.questions);
    } catch (err) {
      error(err.response?.data?.message || 'Không thể tải quiz');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedAnswerIds) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswerIds,
    }));
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = questions.filter((q) => !userAnswers[q._id] || userAnswers[q._id].length === 0);
    if (unanswered.length > 0) {
      error(`Vui lòng trả lời tất cả ${questions.length} câu hỏi`);
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedAnswerIds: userAnswers[q._id] || [],
      }));

      const response = await quizService.submitQuiz(quiz._id, formattedAnswers);
      setResult(response.data.data);
    } catch (err) {
      error(err.response?.data?.message || 'Nộp bài thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!result) {
      error('Hết giờ! Tự động nộp bài...');
      handleSubmit();
    }
  };

  if (loading) return <Loading fullPage />;
  if (!quiz) return null;

  // Show result
  if (result) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizResult result={result} quizTitle={quiz.title} />
        </div>
      </div>
    );
  }

  // Show quiz
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {quiz.title}
            </h1>
            <QuizTimer timeLimit={quiz.timeLimit} onTimeUp={handleTimeUp} />
          </div>

          {quiz.description && (
            <p className="text-gray-600 mb-4">{quiz.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>📝 {questions.length} câu hỏi</span>
            <span>✓ Điểm đạt: {quiz.passingScore}%</span>
            <span>🏆 Phần thưởng: {quiz.xpReward} XP</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {questions.map((question, idx) => (
            <QuizQuestion
              key={question._id}
              question={question}
              questionNumber={idx + 1}
              selectedAnswers={userAnswers[question._id]}
              onAnswerChange={(answers) => handleAnswerChange(question._id, answers)}
            />
          ))}
        </div>

        {/* Submit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Đã trả lời: {Object.keys(userAnswers).length}/{questions.length} câu
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} size="lg">
                {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
