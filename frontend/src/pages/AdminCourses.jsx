import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import courseService from '../services/courseService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

const EMPTY_COURSE = {
  title: '',
  description: '',
  dynasty: '',
  difficulty: 'basic',
  thumbnail: '',
  content: '',
  videoUrl: '',
  duration: 0,
  isPublished: false,
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPlaybackUrl, setSelectedPlaybackUrl] = useState('');
  const [courseModal, setCourseModal] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(EMPTY_COURSE);
  const [uploadingCourseId, setUploadingCourseId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const normalizeCourse = (course) => ({
    ...EMPTY_COURSE,
    ...course,
    thumbnail: course?.thumbnail || '',
    videoUrl: course?.videoUrl || '',
    content: course?.content || '',
    duration: course?.duration || 0,
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllCourses();
      const data = res.data.data;
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch {
      console.error('Fetch courses failed');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetail = async (courseId) => {
    setDetailLoading(true);
    try {
      const res = await courseService.getCourseDetail(courseId);
      const course = res.data.data.course;
      setSelectedCourse(course);
      if (course.videoKey || course.videoUrl?.includes('/video/playback')) {
        const playbackRes = await courseService.getCoursePlaybackUrl(courseId);
        setSelectedPlaybackUrl(playbackRes.data.data.playbackUrl || '');
      } else {
        setSelectedPlaybackUrl(course.videoUrl || '');
      }
    } catch {
      console.error('Load course detail failed');
    } finally {
      setDetailLoading(false);
    }
  };

  const openCourseModal = (course = null) => {
    setCurrentCourse(course ? normalizeCourse(course) : EMPTY_COURSE);
    setIsEditingCourse(Boolean(course));
    setCourseModal(true);
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = normalizeCourse(currentCourse);
      if (isEditingCourse) {
        await adminService.updateCourse(currentCourse._id, payload);
      } else {
        await adminService.createCourse(payload);
      }
      setCourseModal(false);
      await fetchCourses();
      if (selectedCourse && isEditingCourse && selectedCourse._id === currentCourse._id) {
        await loadCourseDetail(currentCourse._id);
      }
    } catch {
      alert('Không thể lưu khóa học');
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Xóa khóa học này?')) return;
    try {
      await adminService.deleteCourse(id);
      if (selectedCourse?._id === id) {
        setSelectedCourse(null);
        setSelectedPlaybackUrl('');
      }
      fetchCourses();
    } catch {
      alert('Không thể xóa khóa học');
    }
  };

  const uploadCourseVideo = async (courseId, file) => {
    const uploadedParts = [];
    let uploadSession = null;
    let uploadedBytes = 0;

    try {
      setUploadingCourseId(courseId);
      setUploadProgress(0);

      const initRes = await adminService.initCourseVideoUpload(courseId, {
        fileName: file.name,
        contentType: file.type || 'video/mp4',
        fileSize: file.size,
      });
      uploadSession = initRes.data.data;

      const partSize = uploadSession.partSize;
      const totalParts = Math.ceil(file.size / partSize);
      const concurrency = 3;
      let nextPart = 1;

      const uploadPart = async (partNumber) => {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);
        const signRes = await adminService.signCourseVideoPart({
          key: uploadSession.key,
          uploadId: uploadSession.uploadId,
          partNumber,
        });

        const uploadRes = await fetch(signRes.data.data.signedUrl, {
          method: 'PUT',
          body: chunk,
          headers: { 'Content-Type': file.type || 'video/mp4' },
        });
        if (!uploadRes.ok) throw new Error(`Upload part ${partNumber} failed`);

        const eTag = uploadRes.headers.get('ETag')?.replaceAll('"', '');
        uploadedParts.push({ PartNumber: partNumber, ETag: eTag });
        uploadedBytes += chunk.size;
        setUploadProgress(Math.round((uploadedBytes / file.size) * 100));
      };

      const workers = Array.from({ length: Math.min(concurrency, totalParts) }, async () => {
        while (nextPart <= totalParts) {
          const partNumber = nextPart;
          nextPart += 1;
          await uploadPart(partNumber);
        }
      });
      await Promise.all(workers);

      uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);
      await adminService.completeCourseVideoUpload(courseId, {
        key: uploadSession.key,
        uploadId: uploadSession.uploadId,
        parts: uploadedParts,
        contentType: file.type || 'video/mp4',
        fileSize: file.size,
      });

      setUploadProgress(100);
      await fetchCourses();
      await loadCourseDetail(courseId);
      alert('Tải video lên thành công');
    } catch (err) {
      if (uploadSession) {
        await adminService.abortCourseVideoUpload({ key: uploadSession.key, uploadId: uploadSession.uploadId }).catch(() => {});
      }
      alert(err.message || 'Không thể tải video lên');
    } finally {
      setUploadingCourseId(null);
      setUploadProgress(0);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <button onClick={() => openCourseModal()} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
          + Thêm khóa học
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">Danh sách khóa học ({courses.length})</div>
            <div className="divide-y max-h-[70vh] overflow-y-auto">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCourse?._id === course._id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                  onClick={() => loadCourseDetail(course._id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.dynasty} &middot; {course.difficulty}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={(e) => { e.stopPropagation(); openCourseModal(course); }} className="text-xs text-blue-600 hover:underline">Sửa</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteCourse(course._id); }} className="text-xs text-red-600 hover:underline">Xóa</button>
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="p-6 text-center text-gray-400">Chưa có khóa học nào</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedCourse ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              Chọn một khóa học để xem và chỉnh nội dung lý thuyết/video
            </div>
          ) : detailLoading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCourse.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCourse.dynasty} &middot; {selectedCourse.difficulty} &middot; {selectedCourse.enrolledCount || 0} học viên
                    </p>
                    {selectedCourse.description && <p className="text-sm text-gray-600 mt-2">{selectedCourse.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm text-white ${uploadingCourseId === selectedCourse._id ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                      {uploadingCourseId === selectedCourse._id ? `Đang tải ${uploadProgress}%` : 'Tải video'}
                      <input
                        type="file"
                        accept="video/*"
                        disabled={uploadingCourseId === selectedCourse._id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadCourseVideo(selectedCourse._id, file);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                    <button onClick={() => openCourseModal(selectedCourse)} className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm">
                      Sửa nội dung
                    </button>
                  </div>
                </div>
              </div>

              {selectedPlaybackUrl ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="aspect-video bg-black">
                    <video className="w-full h-full" controls preload="metadata" src={selectedPlaybackUrl} />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                  Chưa có video cho khóa học này
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Phần lý thuyết</h3>
                {selectedCourse.content ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-6">{selectedCourse.content}</p>
                ) : (
                  <p className="text-sm text-gray-400">Chưa có nội dung lý thuyết</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={courseModal} onClose={() => setCourseModal(false)} title={isEditingCourse ? 'Sửa khóa học' : 'Thêm khóa học'}>
        <form onSubmit={saveCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên khóa học *</label>
            <input type="text" required value={currentCourse.title} onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Triều đại *</label>
              <input type="text" required value={currentCourse.dynasty} onChange={(e) => setCurrentCourse({ ...currentCourse, dynasty: e.target.value })} placeholder="VD: Nhà Trần" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Độ khó</label>
              <select value={currentCourse.difficulty} onChange={(e) => setCurrentCourse({ ...currentCourse, difficulty: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ảnh bìa (URL)</label>
            <input type="text" value={currentCourse.thumbnail || ''} onChange={(e) => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
            <textarea value={currentCourse.description} onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })} rows={3} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3">
            Video được tải lên bằng nút <span className="font-medium">Tải video</span> ở panel chi tiết khóa học và lưu private trong MinIO.
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
            <input type="number" min={0} value={currentCourse.duration} onChange={(e) => setCurrentCourse({ ...currentCourse, duration: Number(e.target.value) })} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phần lý thuyết</label>
            <textarea value={currentCourse.content} onChange={(e) => setCurrentCourse({ ...currentCourse, content: e.target.value })} rows={8} placeholder="Nhập nội dung lý thuyết của khóa học..." className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={currentCourse.isPublished} onChange={(e) => setCurrentCourse({ ...currentCourse, isPublished: e.target.checked })} className="rounded" />
            <label htmlFor="isPublished" className="text-sm">Xuất bản ngay</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setCourseModal(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Lưu</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCourses;
