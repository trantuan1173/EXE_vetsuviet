import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
