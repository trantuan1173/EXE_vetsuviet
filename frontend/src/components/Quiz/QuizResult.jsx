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
              Điểm cần đạt: {passingScore}%
            </div>
          )}
        </div>

        {/* Detailed Results */}
        {result.questionResults && result.questionResults.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Chi tiết kết quả</h3>
            <div className="space-y-6">
              {result.questionResults.map((q, idx) => (
                <div key={q._id} className={`p-4 rounded-lg border ${q.isUserCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex gap-3 mb-3">
                    <span className={`font-bold flex-shrink-0 ${q.isUserCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Câu {idx + 1}:
                    </span>
                    <span className="text-gray-800 font-medium">{q.question}</span>
                  </div>
                  
                  <div className="space-y-2 ml-10">
                    {q.answers.map(a => {
                      const isSelected = q.selectedAnswerIds.includes(a._id);
                      let answerClass = "p-3 rounded border text-sm flex items-center justify-between ";
                      
                      if (a.isCorrect) {
                        answerClass += "bg-green-100 border-green-400 text-green-800 font-medium";
                      } else if (isSelected && !a.isCorrect) {
                        answerClass += "bg-red-100 border-red-400 text-red-800";
                      } else {
                        answerClass += "bg-white border-gray-200 text-gray-600";
                      }

                      return (
                        <div key={a._id} className={answerClass}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 border flex items-center justify-center
                              ${q.questionType === 'multiple' ? 'rounded-sm' : 'rounded-full'}
                              ${isSelected ? 'bg-current border-current' : 'border-gray-400'}`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span>{a.text}</span>
                          </div>
                          {a.isCorrect && <span className="text-green-600 font-bold ml-2">✓ Đáp án đúng</span>}
                          {isSelected && !a.isCorrect && <span className="text-red-600 font-bold ml-2">✗ Bạn chọn</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
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
