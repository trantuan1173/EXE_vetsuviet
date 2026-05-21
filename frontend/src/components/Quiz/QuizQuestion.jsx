const QuizQuestion = ({ question, questionNumber, selectedAnswers, onAnswerChange }) => {
  const handleSelect = (answerId) => {
    if (question.questionType === 'single') {
      onAnswerChange([answerId]);
    } else {
      // Multiple choice
      const current = selectedAnswers || [];
      if (current.includes(answerId)) {
        onAnswerChange(current.filter((id) => id !== answerId));
      } else {
        onAnswerChange([...current, answerId]);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Question Header */}
      <div className="mb-4">
        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
          Câu {questionNumber}
        </span>
        {question.questionType === 'multiple' && (
          <span className="ml-2 text-xs text-gray-500">(Chọn nhiều đáp án)</span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>

      {/* Answers */}
      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswers?.includes(answer._id);

          return (
            <button
              key={answer._id}
              onClick={() => handleSelect(answer._id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-gray-900">{answer.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
