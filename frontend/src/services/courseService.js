import api from './api';

const courseService = {
  getCourses: (params) => api.get('/courses', { params }),

  getCourseDetail: (id) => api.get(`/courses/${id}`),

  getCoursePlaybackUrl: (id) => api.get(`/courses/${id}/video/playback`),

  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),

  getEnrolledCourses: () => api.get('/courses/enrolled'),

  completeCourse: (courseId) => api.post(`/courses/${courseId}/complete`),
};

export default courseService;
