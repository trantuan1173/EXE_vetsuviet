import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPaid, setFilterPaid] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Modal state for adding new enrollment
  const [showModal, setShowModal] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({ userId: '', courseId: '', isPaid: false, note: '' });
  const [submitting, setSubmitting] = useState(false);

  // Available users and courses for the dropdown
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, [pagination.page, filterPaid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchEnrollments();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 20 };
      if (search) params.search = search;
      if (filterPaid !== '') params.isPaid = filterPaid;

      const response = await adminService.getAllEnrollments(params);
      const data = response.data.data;
      setEnrollments(data.enrollments || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.total || 0,
      }));
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        adminService.getAllUsers({ limit: 500 }),
        adminService.getAllCourses({ limit: 500 }),
      ]);
      const usersData = usersRes.data.data;
      const coursesData = coursesRes.data.data;
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData.courses || []);
    } catch (err) {
      console.error('Failed to load users/courses', err);
    }
  };

  const handleOpenModal = () => {
    loadDropdownData();
    setNewEnrollment({ userId: '', courseId: '', isPaid: false, note: '' });
    setShowModal(true);
  };

  const handleCreateEnrollment = async (e) => {
    e.preventDefault();
    if (!newEnrollment.userId || !newEnrollment.courseId) {
      alert('Vui lòng chọn học sinh và khóa học');
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createEnrollment(newEnrollment);
      setShowModal(false);
      fetchEnrollments();
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi tạo đăng ký';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePaid = async (id) => {
    try {
      await adminService.toggleEnrollmentPaid(id);
      fetchEnrollments();
    } catch (err) {
      alert('Không thể cập nhật trạng thái thanh toán');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đăng ký này?')) return;
    try {
      await adminService.deleteEnrollment(id);
      fetchEnrollments();
    } catch (err) {
      alert('Không thể xóa đăng ký');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Quản lý đăng ký khóa học</h1>
        <button
          onClick={handleOpenModal}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm đăng ký
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên, email hoặc khóa học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <select
          value={filterPaid}
          onChange={(e) => { setFilterPaid(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đã thanh toán</option>
          <option value="false">Chưa thanh toán</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-2">Tổng: {pagination.total} đăng ký</p>

      {loading ? (
        <Loading />
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          Chưa có đăng ký nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Học sinh</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Khóa học</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Ngày TT</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Duyệt bởi</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Ghi chú</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{e.userId?.fullName || '—'}</td>
                  <td className="p-4 text-gray-600 text-sm">{e.userId?.email || '—'}</td>
                  <td className="p-4 text-gray-800">{e.courseId?.title || '—'}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        e.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {e.isPaid ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{formatDate(e.paidAt)}</td>
                  <td className="p-4 text-sm text-gray-500">{e.approvedBy?.fullName || '—'}</td>
                  <td className="p-4 text-sm text-gray-500 max-w-[150px] truncate" title={e.note}>{e.note || '—'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePaid(e._id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          e.isPaid
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={e.isPaid ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
                      >
                        {e.isPaid ? 'Hủy TT' : 'Duyệt TT'}
                      </button>
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            ‹ Trước
          </button>
          <span className="px-3 py-1">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Sau ›
          </button>
        </div>
      )}

      {/* Add Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thêm đăng ký khóa học</h2>
            <form onSubmit={handleCreateEnrollment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Học sinh *</label>
                <select
                  value={newEnrollment.userId}
                  onChange={(e) => setNewEnrollment({ ...newEnrollment, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                >
                  <option value="">-- Chọn học sinh --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học *</label>
                <select
                  value={newEnrollment.courseId}
                  onChange={(e) => setNewEnrollment({ ...newEnrollment, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={newEnrollment.isPaid}
                  onChange={(e) => setNewEnrollment({ ...newEnrollment, isPaid: e.target.checked })}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
                  Đã thanh toán
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={newEnrollment.note}
                  onChange={(e) => setNewEnrollment({ ...newEnrollment, note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  rows={3}
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEnrollments;