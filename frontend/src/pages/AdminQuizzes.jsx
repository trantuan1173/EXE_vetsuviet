import { useEffect, useMemo, useRef, useState } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';

const EMPTY_QUIZ = {
  courseId: '',
  title: '',
  description: '',
  timeLimit: 300,
  passingScore: 70,
  xpReward: 10,
  isPublished: false,
};

const EMPTY_QUESTION = {
  question: '',
  questionType: 'single',
  order: 1,
  answers: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ],
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
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

const normalizeQuiz = (quiz) => ({
  ...EMPTY_QUIZ,
  ...quiz,
  courseId: quiz?.courseId?._id || quiz?.courseId || '',
});

const normalizeQuestion = (question) => ({
  ...EMPTY_QUESTION,
  ...question,
  answers: Array.isArray(question?.answers) && question.answers.length > 0
    ? question.answers.map((a) => ({ _id: a._id, text: a.text || '', isCorrect: Boolean(a.isCorrect) }))
    : EMPTY_QUESTION.answers,
});

const AdminQuizzes = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(EMPTY_QUIZ);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(EMPTY_QUESTION);

  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const selectedCourse = useMemo(
    () => courses.find((c) => c._id === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    fetchQuizzes(selectedCourseId);
  }, [selectedCourseId]);

  const initData = async () => {
    setLoading(true);
    try {
      const [courseRes] = await Promise.all([adminService.getAllCourses()]);
      const courseData = courseRes.data.data;
      const courseList = Array.isArray(courseData) ? courseData : courseData.courses || [];
      setCourses(courseList);
    } catch {
      alert('Không thể tải dữ liệu khóa học');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async (courseId = '') => {
    setLoading(true);
    try {
      const res = await adminService.getAllQuizzes(courseId ? { courseId } : undefined);
      const data = res.data.data;
      const list = Array.isArray(data) ? data : data.quizzes || [];
      setQuizzes(list);
      if (selectedQuiz && !list.find((q) => q._id === selectedQuiz._id)) {
        setSelectedQuiz(null);
        setQuestions([]);
      }
    } catch {
      alert('Không thể tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  const openQuizModal = (quiz = null) => {
    setIsEditingQuiz(Boolean(quiz));
    setCurrentQuiz(quiz ? normalizeQuiz(quiz) : { ...EMPTY_QUIZ, courseId: selectedCourseId || '' });
    setQuizModalOpen(true);
  };

  const saveQuiz = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        courseId: currentQuiz.courseId,
        title: currentQuiz.title,
        description: currentQuiz.description,
        timeLimit: Number(currentQuiz.timeLimit),
        passingScore: Number(currentQuiz.passingScore),
        xpReward: Number(currentQuiz.xpReward),
        isPublished: currentQuiz.isPublished,
      };

      if (isEditingQuiz) {
        await adminService.updateQuiz(currentQuiz._id, payload);
      } else {
        await adminService.createQuiz(payload);
      }

      setQuizModalOpen(false);
      await fetchQuizzes(selectedCourseId);
    } catch {
      alert('Không thể lưu quiz');
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm('Xóa quiz này?')) return;
    try {
      await adminService.deleteQuiz(quizId);
      if (selectedQuiz?._id === quizId) {
        setSelectedQuiz(null);
        setQuestions([]);
      }
      await fetchQuizzes(selectedCourseId);
    } catch {
      alert('Không thể xóa quiz');
    }
  };

  const selectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setQuestionLoading(true);
    try {
      const res = await adminService.getQuestionsByQuiz(quiz._id);
      const data = res.data.data;
      setQuestions(Array.isArray(data) ? data : data.questions || []);
    } catch {
      alert('Không thể tải câu hỏi');
    } finally {
      setQuestionLoading(false);
    }
  };

  const openQuestionModal = (question = null) => {
    if (!selectedQuiz) return;
    setIsEditingQuestion(Boolean(question));
    setCurrentQuestion(
      question ? normalizeQuestion(question) : { ...EMPTY_QUESTION, order: questions.length + 1 }
    );
    setQuestionModalOpen(true);
  };

  const updateAnswer = (idx, key, value) => {
    const nextAnswers = [...currentQuestion.answers];
    nextAnswers[idx] = { ...nextAnswers[idx], [key]: value };
    setCurrentQuestion((prev) => ({ ...prev, answers: nextAnswers }));
  };

  const addAnswer = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, { text: '', isCorrect: false }],
    }));
  };

  const removeAnswer = (idx) => {
    if (currentQuestion.answers.length <= 2) return;
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== idx),
    }));
  };

  const saveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    const correctCount = currentQuestion.answers.filter((a) => a.isCorrect).length;
    if (correctCount === 0) {
      alert('Cần ít nhất 1 đáp án đúng');
      return;
    }

    try {
      const payload = {
        quizId: selectedQuiz._id,
        question: currentQuestion.question,
        questionType: currentQuestion.questionType,
        order: Number(currentQuestion.order),
        answers: currentQuestion.answers.map((a) => ({
          text: a.text,
          isCorrect: Boolean(a.isCorrect),
        })),
      };

      if (isEditingQuestion) {
        await adminService.updateQuestion(currentQuestion._id, payload);
      } else {
        await adminService.createQuestion(payload);
      }

      setQuestionModalOpen(false);
      await selectQuiz(selectedQuiz);
    } catch {
      alert('Không thể lưu câu hỏi');
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await adminService.deleteQuestion(questionId);
      await selectQuiz(selectedQuiz);
    } catch {
      alert('Không thể xóa câu hỏi');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await adminService.downloadQuizTemplate();
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mau_cau_hoi_quiz.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Không thể tải file mẫu');
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedQuiz) return;

    setImporting(true);
    try {
      const res = await adminService.importQuizQuestions(selectedQuiz._id, file);
      const data = res.data.data;
      let msg = `Import thành công ${data.imported} câu hỏi!`;
      if (data.errors && data.errors.length > 0) {
        msg += `\n\nCảnh báo (${data.errors.length} dòng lỗi):\n` + data.errors.join('\n');
      }
      alert(msg);
      await selectQuiz(selectedQuiz);
    } catch (err) {
      const errData = err.response?.data?.data;
      if (errData?.errors) {
        alert('Lỗi import:\n' + errData.errors.join('\n'));
      } else {
        alert(err.response?.data?.message || 'Không thể import file');
      }
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Quản lý Quiz theo khóa học</h1>
        <div className="flex gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả khóa học</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => openQuizModal()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            + Thêm Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-semibold">
            Danh sách Quiz ({quizzes.length})
            {selectedCourse ? ` - ${selectedCourse.title}` : ''}
          </div>
          <div className="divide-y max-h-[70vh] overflow-y-auto">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedQuiz?._id === quiz._id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                onClick={() => selectQuiz(quiz)}
              >
                <p className="font-semibold text-gray-900">{quiz.title}</p>
                <p className="text-xs text-gray-500 mt-1">{quiz.courseId?.title || 'Không rõ khóa học'}</p>
                <div className="text-xs text-gray-500 mt-2 flex gap-3">
                  <span>Điểm đạt: {quiz.passingScore}%</span>
                  <span>XP: {quiz.xpReward}</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openQuizModal(quiz); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz._id); }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            {quizzes.length === 0 && <p className="p-6 text-center text-gray-400">Chưa có quiz nào</p>}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {!selectedQuiz ? (
            <p className="text-gray-400 text-center py-10">Chọn một quiz để quản lý câu hỏi</p>
          ) : questionLoading ? (
            <Loading />
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
                  <p className="text-sm text-gray-500">{selectedQuiz.courseId?.title || ''}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleDownloadTemplate}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-300"
                    title="Tải file Excel mẫu"
                  >
                    📥 Tải mẫu Excel
                  </button>
                  <label
                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm border ${
                      importing
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300'
                    }`}
                    title="Import câu hỏi từ file Excel"
                  >
                    {importing ? '⏳ Đang import...' : '📤 Import Excel'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleImportExcel}
                      disabled={importing}
                    />
                  </label>
                  <button
                    onClick={() => openQuestionModal()}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    + Thêm câu hỏi
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-semibold">Câu {q.order}: {q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">Loại: {q.questionType}</p>
                        <ul className="mt-2 text-sm space-y-1">
                          {q.answers?.map((a) => (
                            <li key={a._id} className={a.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                              {a.isCorrect ? '✓ ' : '- '} {a.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openQuestionModal(q)} className="text-blue-600 text-sm hover:underline">
                          Sửa
                        </button>
                        <button onClick={() => deleteQuestion(q._id)} className="text-red-600 text-sm hover:underline">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && <p className="text-gray-400 text-center py-6">Quiz chưa có câu hỏi</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={quizModalOpen} onClose={() => setQuizModalOpen(false)} title={isEditingQuiz ? 'Sửa Quiz' : 'Thêm Quiz'}>
        <form onSubmit={saveQuiz} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khóa học *</label>
            <select
              required
              value={currentQuiz.courseId}
              onChange={(e) => setCurrentQuiz({ ...currentQuiz, courseId: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Chọn khóa học</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
            <input
              required
              value={currentQuiz.title}
              onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              value={currentQuiz.description}
              onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Thời gian (giây)</label>
              <input type="number" min={30} value={currentQuiz.timeLimit} onChange={(e) => setCurrentQuiz({ ...currentQuiz, timeLimit: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Điểm đạt (%)</label>
              <input type="number" min={0} max={100} value={currentQuiz.passingScore} onChange={(e) => setCurrentQuiz({ ...currentQuiz, passingScore: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">XP thưởng</label>
              <input type="number" min={0} value={currentQuiz.xpReward} onChange={(e) => setCurrentQuiz({ ...currentQuiz, xpReward: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={currentQuiz.isPublished} onChange={(e) => setCurrentQuiz({ ...currentQuiz, isPublished: e.target.checked })} />
            <span className="text-sm">Xuất bản quiz</span>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setQuizModalOpen(false)} className="border border-gray-300 px-4 py-2 rounded-lg">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg">Lưu</button>
          </div>
        </form>
      </Modal>

      <Modal open={questionModalOpen} onClose={() => setQuestionModalOpen(false)} title={isEditingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}>
        <form onSubmit={saveQuestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung câu hỏi *</label>
            <textarea
              required
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
              <select
                value={currentQuestion.questionType}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionType: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="single">Một đáp án đúng</option>
                <option value="multiple">Nhiều đáp án đúng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input
                type="number"
                min={1}
                value={currentQuestion.order}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, order: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Đáp án</label>
            {currentQuestion.answers.map((answer, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={answer.isCorrect}
                  onChange={(e) => updateAnswer(idx, 'isCorrect', e.target.checked)}
                />
                <input
                  required
                  value={answer.text}
                  onChange={(e) => updateAnswer(idx, 'text', e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded-lg"
                  placeholder={`Đáp án ${idx + 1}`}
                />
                <button type="button" onClick={() => removeAnswer(idx)} className="text-red-600 text-sm">Xóa</button>
              </div>
            ))}
            <button type="button" onClick={addAnswer} className="text-blue-600 text-sm">+ Thêm đáp án</button>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setQuestionModalOpen(false)} className="border border-gray-300 px-4 py-2 rounded-lg">Hủy</button>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg">Lưu</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminQuizzes;