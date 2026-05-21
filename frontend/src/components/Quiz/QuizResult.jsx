import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

const QuizResult = ({ result, quizTitle }) => {
  const navigate = useNavigate();

  const { totalQuestions, correctAnswers, score, passed, xpEarned, passingScore } = result;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          {passed ? (
            <div className="text-6xl">🎉</div>
          ) : (
            <div className="text-6xl">😔</div>
          )}
        </div>

        {/* Status */}
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          {passed ? 'Chúc mừng!' : 'Chưa đạt'}
        </h2>
        <p className="text-gray-600 mb-6">
          {passed
            ? 'Bạn đã hoàn thành bài quiz thành công!'
            : 'Hãy cố gắng thêm lần sau nhé!'}
        </p>

        {/* Score */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Điểm số</p>
              <p className="text-3xl font-bold text-primary-600">{score}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Số câu đúng</p>
              <p className="text-3xl font-bold text-gray-900">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
          </div>

          {passed && xpEarned > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">XP nhận được</p>
              <p className="text-2xl font-bold text-gold-500">+{xpEarned} XP</p>
            </div>
          )}

          {!passed && (
            <div className="mt-4 text-sm text-gray-600">
              Điểm đạt: {passingScore}%
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} variant="primary">
            Làm lại
          </Button>
          <Button onClick={() => navigate('/courses')} variant="secondary">
            Về khóa học
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
