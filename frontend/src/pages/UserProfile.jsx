import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import userService from '../services/userService';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { formatDate, calculateLevel, getXPForNextLevel } from '../utils/formatters';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [xpHistory, setXpHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({ fullName: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, quizRes, xpRes] = await Promise.all([
        userService.getProfile(),
        userService.getQuizHistory(),
        userService.getXPHistory(),
      ]);

      setProfile(profileRes.data.data);
      setEditForm({
        fullName: profileRes.data.data.fullName,
        avatar: profileRes.data.data.avatar || '',
      });
      setQuizHistory(quizRes.data.data);
      setXpHistory(xpRes.data.data);
    } catch (err) {
      error('Không thể tải hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      const response = await userService.updateProfile(editForm);
      setProfile(response.data.data);
      updateUser(response.data.data);
      success('Cập nhật hồ sơ thành công!');
    } catch (err) {
      error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setEditing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error('Mật khẩu mới không khớp');
      return;
    }

    setChangingPassword(true);
    try {
      await userService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      success('Đổi mật khẩu thành công!');
    } catch (err) {
      error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <Loading fullPage />;
  if (!profile) return null;

  const level = calculateLevel(profile.xp);
  const xpForNext = getXPForNextLevel(profile.xp);
  const progressPercent = ((profile.xp % 100) / 100) * 100;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-600">
                {profile.fullName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                {profile.fullName}
              </h1>
              <p className="text-gray-600">{profile.email}</p>

              {/* XP & Level */}
              <div className="mt-4 flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-primary-600">{level}</p>
                </div>
                <div className="flex-1 max-w-xs">
                  <p className="text-sm text-gray-600 mb-1">
                    XP: {profile.xp} / {level * 100}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Còn {xpForNext} XP để lên level
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['profile', 'quiz', 'xp'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'profile' && '👤 Hồ sơ'}
              {tab === 'quiz' && '❓ Lịch sử Quiz'}
              {tab === 'xp' && '🏆 Lịch sử XP'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Edit Profile */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">
                  Chỉnh sửa hồ sơ
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={editForm.avatar}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, avatar: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <Button type="submit" disabled={editing} className="w-full">
                    {editing ? 'Đang cập nhật...' : 'Cập nhật'}
                  </Button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">
                  Đổi mật khẩu
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <Button type="submit" disabled={changingPassword} className="w-full">
                    {changingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Quiz History Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {quizHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Chưa có lịch sử làm quiz
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Bài Quiz
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Điểm
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          XP
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Ngày
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizHistory.map((item) => (
                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.quizId?.title}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-semibold ${
                                item.passed ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {item.score}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gold-600">
                            +{item.xpEarned}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(item.completedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* XP History Tab */}
          {activeTab === 'xp' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {xpHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Chưa có lịch sử XP
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {xpHistory.map((item) => (
                    <div key={item._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            item.type === 'earn' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {item.type === 'earn' ? '+' : '-'}
                          {item.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
