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
      const coursesResponse = await courseService.getCourses(filters);
      const fetchedCourses = coursesResponse.data.data.courses;
      const token = localStorage.getItem('token');

      if (!token) {
        setCourses(fetchedCourses);
      } else {
        const enrollmentsResponse = await courseService.getEnrolledCourses();
        const paidCourseIds = new Set(
          enrollmentsResponse.data.data
            .filter((enrollment) => enrollment.isPaid)
            .map((enrollment) => enrollment.courseId?._id || enrollment.courseId)
        );

        setCourses(
          fetchedCourses.map((course) => ({
            ...course,
            isPaid: paidCourseIds.has(course._id),
          }))
        );
      }

      setPagination(coursesResponse.data.data.pagination);
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

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
            Khóa học Lịch sử Việt Nam
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Khám phá các triều đại lịch sử qua khóa học tương tác
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            {(filters.search || filters.dynasty || filters.difficulty) && (
              <span className="ml-1 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                {[filters.search, filters.dynasty, filters.difficulty].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block lg:col-span-1">
            <CourseFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilter && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileFilter(false)}
              />
              <div className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white z-50 lg:hidden overflow-y-auto shadow-xl">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <CourseFilter filters={filters} onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    setShowMobileFilter(false);
                  }} />
                </div>
              </div>
            </>
          )}

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
