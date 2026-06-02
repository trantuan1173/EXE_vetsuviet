import api from './api';

const courseService = {
  getCourses: (params) => api.get('/courses', { params }),

  getRandomCourses: (limit = 3) => api.get('/courses/random', { params: { limit } }),

  getCourseDetail: (id) => api.get(`/courses/${id}`),

  getCoursePlaybackUrl: (id) => api.get(`/courses/${id}/video/playback`),

  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),

  getEnrolledCourses: () => api.get('/courses/enrolled'),

  completeCourse: (courseId) => api.post(`/courses/${courseId}/complete`),
};

export default courseService;
