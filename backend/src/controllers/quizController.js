const quizService = require('../services/quizService');
const { sendResponse } = require('../utils/response');
const XLSX = require('xlsx');
const QuizQuestion = require('../models/QuizQuestion');

const quizController = {
  // GET /api/quiz/course/:courseId
  getQuizByCourse: async (req, res, next) => {
    try {
      const result = await quizService.getQuizByCourse(req.params.courseId);
      sendResponse(res, 200, true, 'Quiz retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/quiz/lesson/:lessonId
  getQuizByLesson: async (req, res, next) => {
    try {
      const result = await quizService.getQuizByLesson(req.params.lessonId);
      sendResponse(res, 200, true, 'Quiz retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/quiz/submit
  submitQuiz: async (req, res, next) => {
    try {
      const { quizId, userAnswers } = req.body;
      const result = await quizService.submitQuiz(req.user.id, quizId, userAnswers);
      sendResponse(res, 200, true, 'Quiz submitted', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/quiz/history
  getQuizHistory: async (req, res, next) => {
    try {
      const history = await quizService.getUserQuizHistory(req.user.id);
      sendResponse(res, 200, true, 'Quiz history retrieved', history);
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN ----
  // GET /api/admin/quizzes
  getAllQuizzes: async (req, res, next) => {
    try {
      const { courseId } = req.query;
      const quizzes = await quizService.getAllQuizzes(courseId);
      sendResponse(res, 200, true, 'Quizzes retrieved', quizzes);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/quizzes
  createQuiz: async (req, res, next) => {
    try {
      const quiz = await quizService.createQuiz(req.body);
      sendResponse(res, 201, true, 'Quiz created', quiz);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/quizzes/:id
  updateQuiz: async (req, res, next) => {
    try {
      const quiz = await quizService.updateQuiz(req.params.id, req.body);
      sendResponse(res, 200, true, 'Quiz updated', quiz);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/quizzes/:id
  deleteQuiz: async (req, res, next) => {
    try {
      await quizService.deleteQuiz(req.params.id);
      sendResponse(res, 200, true, 'Quiz deleted');
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/quizzes/:quizId/questions
  getQuestionsByQuiz: async (req, res, next) => {
    try {
      const questions = await quizService.getQuestionsByQuiz(req.params.quizId);
      sendResponse(res, 200, true, 'Questions retrieved', questions);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/questions
  createQuestion: async (req, res, next) => {
    try {
      const question = await quizService.createQuestion(req.body);
      sendResponse(res, 201, true, 'Question created', question);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/questions/:id
  updateQuestion: async (req, res, next) => {
    try {
      const question = await quizService.updateQuestion(req.params.id, req.body);
      sendResponse(res, 200, true, 'Question updated', question);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/questions/:id
  deleteQuestion: async (req, res, next) => {
    try {
      await quizService.deleteQuestion(req.params.id);
      sendResponse(res, 200, true, 'Question deleted');
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/quizzes/template - Download Excel template
  downloadTemplate: async (req, res, next) => {
    try {
      const sampleData = [
        {
          STT: 1,
          'Câu hỏi': 'Ai là vị vua đầu tiên của nhà Trần?',
          'Loại (single/multiple)': 'single',
          'Đáp án A': 'Trần Thái Tông',
          'Đáp án B': 'Trần Thánh Tông',
          'Đáp án C': 'Trần Nhân Tông',
          'Đáp án D': 'Trần Anh Tông',
          'Đáp án đúng': 'A',
        },
        {
          STT: 2,
          'Câu hỏi': 'Những trận đánh nào thuộc thời kỳ kháng chiến chống Nguyên Mông?',
          'Loại (single/multiple)': 'multiple',
          'Đáp án A': 'Bạch Đằng',
          'Đáp án B': 'Chi Lăng',
          'Đáp án C': 'Chương Dương',
          'Đáp án D': 'Đống Đa',
          'Đáp án đúng': 'A,C',
        },
      ];

      const ws = XLSX.utils.json_to_sheet(sampleData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 50 }, // Câu hỏi
        { wch: 20 }, // Loại
        { wch: 30 }, // Đáp án A
        { wch: 30 }, // Đáp án B
        { wch: 30 }, // Đáp án C
        { wch: 30 }, // Đáp án D
        { wch: 15 }, // Đáp án đúng
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CauHoi');

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=mau_cau_hoi_quiz.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/quizzes/:quizId/import - Import questions from Excel
  importQuestions: async (req, res, next) => {
    try {
      if (!req.file) {
        return sendResponse(res, 400, false, 'Vui lòng tải lên file Excel');
      }

      const quizId = req.params.quizId;

      // Read Excel file from buffer
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (!rows || rows.length === 0) {
        return sendResponse(res, 400, false, 'File Excel không có dữ liệu');
      }

      const answerLetters = ['A', 'B', 'C', 'D'];
      const errors = [];
      const questionsToCreate = [];

      // Get current max order for the quiz
      const existingQuestions = await QuizQuestion.find({ quizId }).sort({ order: -1 }).limit(1);
      let currentMaxOrder = existingQuestions.length > 0 ? existingQuestions[0].order : 0;

      rows.forEach((row, index) => {
        const rowNum = index + 2; // Excel row (header = row 1)
        const questionText = row['Câu hỏi'];
        const questionType = (row['Loại (single/multiple)'] || 'single').toLowerCase().trim();
        const correctAnswerRaw = String(row['Đáp án đúng'] || '').toUpperCase().trim();

        if (!questionText) {
          errors.push(`Dòng ${rowNum}: Thiếu câu hỏi`);
          return;
        }

        if (!['single', 'multiple'].includes(questionType)) {
          errors.push(`Dòng ${rowNum}: Loại câu hỏi phải là "single" hoặc "multiple"`);
          return;
        }

        if (!correctAnswerRaw) {
          errors.push(`Dòng ${rowNum}: Thiếu đáp án đúng`);
          return;
        }

        const correctLetters = correctAnswerRaw.split(',').map((s) => s.trim()).filter(Boolean);

        // Build answers
        const answers = [];
        answerLetters.forEach((letter) => {
          const answerText = row[`Đáp án ${letter}`];
          if (answerText !== undefined && answerText !== null && String(answerText).trim() !== '') {
            answers.push({
              text: String(answerText).trim(),
              isCorrect: correctLetters.includes(letter),
            });
          }
        });

        if (answers.length < 2) {
          errors.push(`Dòng ${rowNum}: Cần ít nhất 2 đáp án`);
          return;
        }

        const correctCount = answers.filter((a) => a.isCorrect).length;
        if (correctCount === 0) {
          errors.push(`Dòng ${rowNum}: Không có đáp án đúng hợp lệ (kiểm tra cột "Đáp án đúng")`);
          return;
        }

        currentMaxOrder++;

        questionsToCreate.push({
          quizId,
          question: String(questionText).trim(),
          questionType,
          order: row['STT'] ? Number(row['STT']) : currentMaxOrder,
          answers,
        });
      });

      if (errors.length > 0 && questionsToCreate.length === 0) {
        return sendResponse(res, 400, false, 'Không thể import do lỗi dữ liệu', { errors });
      }

      // Bulk insert valid questions
      const created = await QuizQuestion.insertMany(questionsToCreate);

      sendResponse(res, 201, true, `Import thành công ${created.length} câu hỏi`, {
        imported: created.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = quizController;
