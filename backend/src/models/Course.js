const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    dynasty: {
      type: String,
      required: [true, 'Dynasty is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'basic',
    },
    thumbnail: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: null,
    },
    videoKey: {
      type: String,
      default: null,
    },
    videoMimeType: {
      type: String,
      default: null,
    },
    videoSize: {
      type: Number,
      default: 0,
      min: 0,
    },
    coverImageKey: {
      type: String,
      default: null,
    },
    coverImageMimeType: {
      type: String,
      default: null,
    },
    coverImageSize: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index({ dynasty: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ title: 'text' }); // Text search

module.exports = mongoose.model('Course', courseSchema);
