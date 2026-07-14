import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';
import Pagination from '../components/Common/Pagination';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers({ page, limit: 10 });
      const data = response.data.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: data.length });
      } else {
        setUsers(data.users || []);
        setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      alert('Không thể cập nhật trạng thái');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <span className="text-sm text-gray-500">
          Tổng: {pagination.totalItems} người dùng
        </span>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Tên</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(user._id)}
                    className="text-primary-600 hover:underline"
                  >
                    {user.isActive ? 'Khóa' : 'Mở khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </AdminLayout>
  );
};

export default AdminUsers;