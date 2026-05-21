import api from './api';

const courseService = {
  getCourses: (params) => api.get('/courses', { params }),

  getCourseDetail: (id) => api.get(`/courses/${id}`),

  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),

  getEnrolledCourses: () => api.get('/courses/enrolled'),

  completeLesson: (courseId, lessonId) =>
    api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
};

export default courseService;
