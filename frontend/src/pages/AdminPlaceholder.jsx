import Sidebar from '../components/Layout/Sidebar';

const AdminPlaceholder = ({ title, icon }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
          {icon} {title}
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">
            Trang quản lý {title} đang được phát triển...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Sử dụng API trực tiếp hoặc công cụ như Postman để quản lý dữ liệu tạm thời.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
