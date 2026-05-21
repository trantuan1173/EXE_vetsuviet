import { useState } from 'react';
import { Link } from 'react-router-dom';

const ChapterTree = ({ chapters }) => {
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  return (
    <div className="space-y-2">
      {chapters.map((chapter) => (
        <div key={chapter._id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Chapter Header */}
          <button
            onClick={() => toggleChapter(chapter._id)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-primary-600 font-semibold">
                {expandedChapters[chapter._id] ? '▼' : '▶'}
              </span>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                {chapter.description && (
                  <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {chapter.lessons?.length || 0} bài học
            </span>
          </button>

          {/* Lessons */}
          {expandedChapters[chapter._id] && chapter.lessons && (
            <div className="bg-white">
              {chapter.lessons.map((lesson, idx) => (
                <Link
                  key={lesson._id}
                  to={`/lessons/${lesson._id}`}
                  className="flex items-center gap-3 p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-400 font-medium w-8">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                    {lesson.duration > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        ⏱ {Math.floor(lesson.duration / 60)} phút
                      </p>
                    )}
                  </div>
                  {lesson.videoUrl && (
                    <span className="text-xs text-primary-600">▶ Video</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChapterTree;
