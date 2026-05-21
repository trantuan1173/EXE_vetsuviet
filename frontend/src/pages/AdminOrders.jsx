import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';
import { formatCurrency, formatDate } from '../utils/formatters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllOrders();
      const data = response.data.data;
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      alert('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">ID Đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-4 font-mono text-xs">{order._id.substring(18)}</td>
                <td className="p-4">
                  <p className="font-medium">{order.shippingAddress?.fullName}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-sm">{formatDate(order.createdAt)}</td>
                <td className="p-4 font-semibold">{formatCurrency(order.totalAmount)}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className={`p-1 border rounded text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang đóng gói</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="p-4">
                   <button className="text-primary-600 hover:underline text-sm">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
