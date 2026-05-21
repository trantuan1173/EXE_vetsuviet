const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Lesson order is required'],
      min: 1,
    },
    content: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonSchema.index({ courseId: 1 });
lessonSchema.index({ chapterId: 1 });
lessonSchema.index({ chapterId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
