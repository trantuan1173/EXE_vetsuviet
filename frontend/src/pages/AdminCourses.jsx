import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import courseService from '../services/courseService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

// ─── Constants ───────────────────────────────────────────────
const EMPTY_COURSE = {
  title: '',
  description: '',
  dynasty: '',
  difficulty: 'basic',
  thumbnail: '',
  isPublished: false,
};
const EMPTY_CHAPTER = { title: '', description: '', order: 1 };
const EMPTY_LESSON = { title: '', content: '', videoUrl: '', order: 1, duration: 0 };

// ─── Reusable Modal Shell ────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────
const AdminCourses = () => {
  // ── Course list state ──
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseModal, setCourseModal] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(EMPTY_COURSE);

  // ── Detail panel state ──
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Chapter modal state ──
  const [chapterModal, setChapterModal] = useState(false);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(EMPTY_CHAPTER);

  // ── Lesson modal state ──
  const [lessonModal, setLessonModal] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(EMPTY_LESSON);
  const [lessonChapterId, setLessonChapterId] = useState(null);

  // ── Fetch courses ──
  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllCourses();
      const d = res.data.data;
      setCourses(Array.isArray(d) ? d : d.courses || []);
    } catch { console.error('Fetch courses failed'); }
    finally { setLoading(false); }
  };

  // ── Load course detail (chapters + lessons tree) ──
  const loadCourseDetail = async (courseId) => {
    setDetailLoading(true);
    try {
      const res = await courseService.getCourseDetail(courseId);
      const d = res.data.data;
      setSelectedCourse(d.course);
      setChapters(d.chapters || []);
    } catch { console.error('Load detail failed'); }
    finally { setDetailLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════
  //  COURSE CRUD
  // ═══════════════════════════════════════════════════════════
  const openCourseModal = (course = null) => {
    if (course) { setCurrentCourse(course); setIsEditingCourse(true); }
    else { setCurrentCourse(EMPTY_COURSE); setIsEditingCourse(false); }
    setCourseModal(true);
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      if (isEditingCourse) await adminService.updateCourse(currentCourse._id, currentCourse);
      else await adminService.createCourse(currentCourse);
      setCourseModal(false);
      fetchCourses();
      if (selectedCourse && isEditingCourse && selectedCourse._id === currentCourse._id)
        loadCourseDetail(currentCourse._id);
    } catch { alert('Không thể lưu khóa học'); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Xóa khóa học này và toàn bộ nội dung bên trong?')) return;
    try {
      await adminService.deleteCourse(id);
      if (selectedCourse?._id === id) { setSelectedCourse(null); setChapters([]); }
      fetchCourses();
    } catch { alert('Không thể xóa'); }
  };

  // ═══════════════════════════════════════════════════════════
  //  CHAPTER CRUD
  // ═══════════════════════════════════════════════════════════
  const openChapterModal = (chapter = null) => {
    if (chapter) { setCurrentChapter(chapter); setIsEditingChapter(true); }
    else {
      setCurrentChapter({ ...EMPTY_CHAPTER, order: chapters.length + 1 });
      setIsEditingChapter(false);
    }
    setChapterModal(true);
  };

  const saveChapter = async (e) => {
    e.preventDefault();
    try {
      if (isEditingChapter) await adminService.updateChapter(currentChapter._id, currentChapter);
      else await adminService.createChapter({ ...currentChapter, courseId: selectedCourse._id });
      setChapterModal(false);
      loadCourseDetail(selectedCourse._id);
    } catch { alert('Không thể lưu chương'); }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm('Xóa chương này?')) return;
    try {
      await adminService.deleteChapter(id);
      loadCourseDetail(selectedCourse._id);
    } catch { alert('Không thể xóa chương'); }
  };

  // ═══════════════════════════════════════════════════════════
  //  LESSON CRUD
  // ═══════════════════════════════════════════════════════════
  const openLessonModal = (chapterId, lesson = null) => {
    setLessonChapterId(chapterId);
    if (lesson) { setCurrentLesson(lesson); setIsEditingLesson(true); }
    else {
      const chapter = chapters.find(c => c._id === chapterId);
      setCurrentLesson({ ...EMPTY_LESSON, order: (chapter?.lessons?.length || 0) + 1 });
      setIsEditingLesson(false);
    }
    setLessonModal(true);
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    try {
      if (isEditingLesson) await adminService.updateLesson(currentLesson._id, currentLesson);
      else await adminService.createLesson({ ...currentLesson, chapterId: lessonChapterId });
      setLessonModal(false);
      loadCourseDetail(selectedCourse._id);
    } catch { alert('Không thể lưu bài học'); }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Xóa bài học này?')) return;
    try {
      await adminService.deleteLesson(id);
      loadCourseDetail(selectedCourse._id);
    } catch { alert('Không thể xóa bài học'); }
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════
  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <button onClick={() => openCourseModal()} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
          + Thêm khóa học
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ══════════  LEFT: Course Table  ══════════ */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">Danh sách khóa học ({courses.length})</div>
            <div className="divide-y max-h-[70vh] overflow-y-auto">
              {courses.map(course => (
                <div
                  key={course._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCourse?._id === course._id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                  onClick={() => loadCourseDetail(course._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.dynasty} &middot; {course.difficulty}</p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
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

        {/* ══════════  RIGHT: Course Detail — Chapters & Lessons  ══════════ */}
        <div className="lg:col-span-2">
          {!selectedCourse ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              Chọn một khóa học bên trái để quản lý nội dung
            </div>
          ) : detailLoading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              {/* Course info header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCourse.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedCourse.dynasty} &middot; {selectedCourse.difficulty} &middot; {selectedCourse.enrolledCount || 0} học viên</p>
                    {selectedCourse.description && <p className="text-sm text-gray-600 mt-2">{selectedCourse.description}</p>}
                  </div>
                  <button onClick={() => openChapterModal()} className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors flex-shrink-0">
                    + Thêm chương
                  </button>
                </div>
              </div>

              {/* Chapters + Lessons tree */}
              {chapters.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                  Khóa học chưa có chương nào. Hãy thêm chương đầu tiên.
                </div>
              ) : (
                chapters.map(chapter => (
                  <div key={chapter._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Chapter header */}
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-primary-600 mr-2">Chương {chapter.order}</span>
                        <span className="font-semibold text-gray-900">{chapter.title}</span>
                        {chapter.description && <p className="text-xs text-gray-500 mt-0.5">{chapter.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openLessonModal(chapter._id)} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors">
                          + Bài học
                        </button>
                        <button onClick={() => openChapterModal(chapter)} className="text-xs text-blue-600 hover:underline">Sửa</button>
                        <button onClick={() => deleteChapter(chapter._id)} className="text-xs text-red-600 hover:underline">Xóa</button>
                      </div>
                    </div>
                    {/* Lessons list */}
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      <div className="divide-y">
                        {chapter.lessons.map(lesson => (
                          <div key={lesson._id} className="p-3 px-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <span className="text-xs bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center font-mono">{lesson.order}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                                <p className="text-xs text-gray-400">
                                  {lesson.duration > 0 && `${lesson.duration} phút`}
                                  {lesson.videoUrl && ' · Video'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openLessonModal(chapter._id, lesson)} className="text-xs text-blue-600 hover:underline">Sửa</button>
                              <button onClick={() => deleteLesson(lesson._id)} className="text-xs text-red-600 hover:underline">Xóa</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-gray-400 text-center">Chưa có bài học</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MODAL: Course Form
      ═══════════════════════════════════════════════════════ */}
      <Modal open={courseModal} onClose={() => setCourseModal(false)} title={isEditingCourse ? 'Sửa khóa học' : 'Thêm khóa học'}>
        <form onSubmit={saveCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên khóa học *</label>
            <input type="text" required value={currentCourse.title}
              onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Triều đại *</label>
              <input type="text" required value={currentCourse.dynasty}
                onChange={e => setCurrentCourse({ ...currentCourse, dynasty: e.target.value })}
                placeholder="VD: Nhà Trần"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Độ khó</label>
              <select value={currentCourse.difficulty}
                onChange={e => setCurrentCourse({ ...currentCourse, difficulty: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ảnh bìa (URL)</label>
            <input type="text" value={currentCourse.thumbnail || ''}
              onChange={e => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea value={currentCourse.description}
              onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={currentCourse.isPublished}
              onChange={e => setCurrentCourse({ ...currentCourse, isPublished: e.target.checked })} className="rounded" />
            <label htmlFor="isPublished" className="text-sm">Xuất bản ngay</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setCourseModal(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          MODAL: Chapter Form
      ═══════════════════════════════════════════════════════ */}
      <Modal open={chapterModal} onClose={() => setChapterModal(false)} title={isEditingChapter ? 'Sửa chương' : 'Thêm chương mới'}>
        <form onSubmit={saveChapter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên chương *</label>
            <input type="text" required value={currentChapter.title}
              onChange={e => setCurrentChapter({ ...currentChapter, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thứ tự</label>
            <input type="number" min={1} value={currentChapter.order}
              onChange={e => setCurrentChapter({ ...currentChapter, order: Number(e.target.value) })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea value={currentChapter.description}
              onChange={e => setCurrentChapter({ ...currentChapter, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setChapterModal(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          MODAL: Lesson Form
      ═══════════════════════════════════════════════════════ */}
      <Modal open={lessonModal} onClose={() => setLessonModal(false)} title={isEditingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}>
        <form onSubmit={saveLesson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề bài học *</label>
            <input type="text" required value={currentLesson.title}
              onChange={e => setCurrentLesson({ ...currentLesson, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input type="number" min={1} value={currentLesson.order}
                onChange={e => setCurrentLesson({ ...currentLesson, order: Number(e.target.value) })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
              <input type="number" min={0} value={currentLesson.duration}
                onChange={e => setCurrentLesson({ ...currentLesson, duration: Number(e.target.value) })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input type="text" value={currentLesson.videoUrl || ''}
              onChange={e => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })}
              placeholder="https://youtube.com/..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung bài học</label>
            <textarea value={currentLesson.content}
              onChange={e => setCurrentLesson({ ...currentLesson, content: e.target.value })}
              rows={6}
              placeholder="Nội dung bài học (hỗ trợ text)..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setLessonModal(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Lưu</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCourses;
