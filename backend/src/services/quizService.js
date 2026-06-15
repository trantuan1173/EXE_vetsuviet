const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizHistory = require('../models/QuizHistory');
const User = require('../models/User');
const RewardTransaction = require('../models/RewardTransaction');

const quizService = {
  // Get quiz by course ID (for user)
  getQuizByCourse: async (courseId) => {
    const quiz = await Quiz.findOne({ courseId, isPublished: true });
    if (!quiz) throw new Error('Quiz not found');

    const questions = await QuizQuestion.find({ quizId: quiz._id }).sort({ order: 1 });

    // Remove isCorrect from answers (don't expose correct answers to client)
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      questionType: q.questionType,
      order: q.order,
      answers: q.answers.map((a) => ({
        _id: a._id,
        text: a.text,
      })),
    }));

    return { quiz, questions: safeQuestions };
  },

  getQuizByLesson: async (lessonId) => {
    const quiz = await Quiz.findOne({ lessonId, isPublished: true });
    if (!quiz) throw new Error('Quiz not found');

    const questions = await QuizQuestion.find({ quizId: quiz._id }).sort({ order: 1 });
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      questionType: q.questionType,
      order: q.order,
      answers: q.answers.map((a) => ({ _id: a._id, text: a.text })),
    }));

    return { quiz, questions: safeQuestions };
  },

  // Submit quiz and calculate score
  submitQuiz: async (userId, quizId, userAnswers) => {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const questions = await QuizQuestion.find({ quizId }).sort({ order: 1 });
    if (questions.length === 0) throw new Error('No questions in this quiz');

    let correctCount = 0;
    const questionResults = [];

    // Compare answers
    for (const question of questions) {
      const userAnswer = userAnswers.find(
        (a) => a.questionId === question._id.toString()
      );

      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a._id.toString());

      const selectedIds = userAnswer ? userAnswer.selectedAnswerIds.map((id) => id.toString()) : [];

      // Check if all correct answers match
      const isCorrect =
        correctAnswerIds.length === selectedIds.length &&
        correctAnswerIds.every((id) => selectedIds.includes(id));

      if (isCorrect) correctCount++;

      questionResults.push({
        _id: question._id,
        question: question.question,
        questionType: question.questionType,
        order: question.order,
        answers: question.answers.map(a => ({
          _id: a._id,
          text: a.text,
          isCorrect: a.isCorrect
        })),
        selectedAnswerIds: selectedIds,
        isUserCorrect: isCorrect
      });
    }

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : 0;

    // Save quiz history
    const history = new QuizHistory({
      userId,
      quizId,
      courseId: quiz.courseId,
      totalQuestions,
      correctAnswers: correctCount,
      score,
      passed,
      xpEarned,
      userAnswers,
    });
    await history.save();

    // If passed, add XP to user and log reward transaction
    if (passed) {
      const user = await User.findById(userId);
      user.xp += xpEarned;
      user.calculateLevel();
      await user.save();

      // Log reward transaction
      const rewardTx = new RewardTransaction({
        userId,
        type: 'earn',
        amount: xpEarned,
        description: `Completed quiz: ${quiz.title}`,
        relatedId: quiz._id,
      });
      await rewardTx.save();
    }

    return {
      totalQuestions,
      correctAnswers: correctCount,
      score,
      passed,
      xpEarned,
      passingScore: quiz.passingScore,
      questionResults,
    };
  },

  // Get quiz history for user
  getUserQuizHistory: async (userId) => {
    return await QuizHistory.find({ userId })
      .populate('quizId', 'title')
      .populate('courseId', 'title')
      .sort({ completedAt: -1 });
  },

  // Admin: CRUD Quiz
  createQuiz: async (data) => {
    const quiz = new Quiz(data);
    return await quiz.save();
  },

  updateQuiz: async (quizId, data) => {
    const quiz = await Quiz.findByIdAndUpdate(quizId, data, {
      new: true,
      runValidators: true,
    });
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  },

  deleteQuiz: async (quizId) => {
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) throw new Error('Quiz not found');
    await QuizQuestion.deleteMany({ quizId });
    return quiz;
  },

  // Admin: CRUD QuizQuestion
  createQuestion: async (data) => {
    const quiz = await Quiz.findById(data.quizId);
    if (!quiz) throw new Error('Quiz not found');

    const question = new QuizQuestion(data);
    return await question.save();
  },

  updateQuestion: async (questionId, data) => {
    const question = await QuizQuestion.findByIdAndUpdate(questionId, data, {
      new: true,
      runValidators: true,
    });
    if (!question) throw new Error('Question not found');
    return question;
  },

  deleteQuestion: async (questionId) => {
    const question = await QuizQuestion.findByIdAndDelete(questionId);
    if (!question) throw new Error('Question not found');
    return question;
  },

  // Admin: Get all quizzes
  getAllQuizzes: async (courseId) => {
    const query = courseId ? { courseId } : {};
    return await Quiz.find(query).populate('courseId', 'title').sort({ createdAt: -1 });
  },

  // Admin: Get questions by quiz
  getQuestionsByQuiz: async (quizId) => {
    return await QuizQuestion.find({ quizId }).sort({ order: 1 });
  },
};

module.exports = quizService;
