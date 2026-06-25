import { DYNASTIES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const CourseFilter = ({ filters, onFilterChange }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Bộ lọc</h3>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tên khóa học..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Dynasty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Triều đại
          </label>
          <select
            value={filters.dynasty || ''}
            onChange={(e) => onFilterChange({ dynasty: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả</option>
            {DYNASTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ khó
          </label>
          <select
            value={filters.difficulty || ''}
            onChange={(e) => onFilterChange({ difficulty: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả</option>
            {DIFFICULTY_LEVELS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => onFilterChange({ search: '', dynasty: '', difficulty: '' })}
          className="w-full text-sm text-gray-600 hover:text-primary-600 font-medium"
        >
          Xóa bộ lọc
        </button>

        <button
          onClick={() => navigate('/shop')}
          className="w-full sm:py-4 text-s font-bold tracking-wider text-white hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#6F0D0D',
            borderRadius: '5px',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '1.2px',
            lineHeight: '16px',
          }}
        >
          Sản phẩm
        </button>
      </div>
    </div>
  );
};

export default CourseFilter;
