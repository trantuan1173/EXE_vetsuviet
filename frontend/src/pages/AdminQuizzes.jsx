import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllQuizzes();
      const data = response.data.data;
      setQuizzes(Array.isArray(data) ? data : data.quizzes || []);
    } catch (err) {
      console.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa quiz này?')) return;
    try {
      await adminService.deleteQuiz(id);
      fetchQuizzes();
    } catch (err) {
      alert('Không thể xóa quiz');
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Quiz</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">+ Thêm Quiz</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Tiêu đề Quiz</th>
              <th className="p-4">Điểm qua môn</th>
              <th className="p-4">Thưởng XP</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz._id} className="border-t">
                <td className="p-4 font-semibold">{quiz.title}</td>
                <td className="p-4">{quiz.passingScore}%</td>
                <td className="p-4 text-gold-600 font-bold">+{quiz.rewardXP} XP</td>
                <td className="p-4 space-x-2">
                  <button className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(quiz._id)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default AdminQuizzes;
