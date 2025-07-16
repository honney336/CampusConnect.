import api from './api';

export const enrollmentService = {
  // Enroll student in course (admin)
  enrollStudent: async (studentId, courseId) => {
    const response = await api.post('/api/enrollment/enroll', {
      studentId,
      courseId
    });
    return response.data;
  },

  // Get student enrollments
  getStudentEnrollments: async () => {
    const response = await api.get('/api/enrollment/enrollments');
    return response.data;
  },

  // Get course enrollments (faculty/admin)
  getCourseEnrollments: async (courseId) => {
    const response = await api.get(`/api/enrollment/course-enrollments/${courseId}`);
    return response.data;
  },

  // Get all enrollments (admin)
  getAllEnrollments: async () => {
    const response = await api.get('/api/enrollment/all-enrollments');
    return response.data;
  },

  // Remove enrollment (admin)
  removeEnrollment: async (enrollmentId) => {
    const response = await api.delete(`/api/enrollment/remove-enrollment/${enrollmentId}`);
    return response.data;
  }
};