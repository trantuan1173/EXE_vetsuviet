import { Link } from 'react-router-dom';
import Card from '../Common/Card';

const CourseCard = ({ course }) => {
  const difficultyColors = {
    basic: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const difficultyLabels = {
    basic: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
  };

  return (
    <Link to={`/courses/${course._id}`}>
      <Card hover>
        <Card.Image src={course.thumbnail} alt={course.title} />
        <Card.Body>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {course.dynasty}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                difficultyColors[course.difficulty]
              }`}
            >
              {difficultyLabels[course.difficulty]}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {course.description}
          </p>
        </Card.Body>
        <Card.Footer>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              👥 {course.enrolledCount || 0} học viên
            </span>
            <span className="text-primary-600 font-semibold">Xem chi tiết →</span>
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default CourseCard;
