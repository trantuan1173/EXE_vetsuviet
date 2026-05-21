import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import courseService from '../services/courseService';
import CourseCard from '../components/Course/CourseCard';
import CourseFilter from '../components/Course/CourseFilter';
import Pagination from '../components/Common/Pagination';
import Loading from '../components/Common/Loading';
import { useNotification } from '../hooks/useNotification';

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { error } = useNotification();

  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    dynasty: searchParams.get('dynasty') || '',
    difficulty: searchParams.get('difficulty') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourses(filters);
      setCourses(response.data.data.courses);
      setPagination(response.data.data.pagination);
    } catch (err) {
      error(err.response?.data?.message || 'Không thể tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    // Update URL params
    const params = {};
    if (updated.search) params.search = updated.search;
    if (updated.dynasty) params.dynasty = updated.dynasty;
    if (updated.difficulty) params.difficulty = updated.difficulty;
    if (updated.page > 1) params.page = updated.page;
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    setSearchParams({ ...Object.fromEntries(searchParams), page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Khóa học Lịch sử Việt Nam
          </h1>
          <p className="text-gray-600">
            Khám phá các triều đại lịch sử qua khóa học tương tác
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <CourseFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading />
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
