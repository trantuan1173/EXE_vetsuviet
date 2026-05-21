import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      const data = response.data.data;
      setUsers(Array.isArray(data) ? data : data.users || []);
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

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Quản lý người dùng</h1>
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
    </AdminLayout>
  );
};

export default AdminUsers;
