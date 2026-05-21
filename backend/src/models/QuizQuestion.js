const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Answer text is required'],
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const quizQuestionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required'],
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    questionType: {
      type: String,
      enum: ['single', 'multiple'],
      default: 'single',
    },
    order: {
      type: Number,
      required: [true, 'Question order is required'],
      min: 1,
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: function (v) {
          return v && v.length >= 2;
        },
        message: 'At least 2 answers are required',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizQuestionSchema.index({ quizId: 1 });
quizQuestionSchema.index({ quizId: 1, order: 1 });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
