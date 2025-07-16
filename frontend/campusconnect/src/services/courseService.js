import api from './api';

export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    const response = await api.get('/api/course/allcourses');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/api/course/course/${id}`);
    return response.data;
  },

  // Get faculty courses
  getFacultyCourses: async () => {
    const response = await api.get('/api/course/facultycourses');
    return response.data;
  },

  // Create course (faculty/admin)
  createCourse: async (courseData) => {
    const response = await api.post('/api/course/createcourse', courseData);
    return response.data;
  },

  // Update course (faculty/admin)
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/api/course/updatecourse/${id}`, courseData);
    return response.data;
  },

  // Delete course (faculty/admin)
  deleteCourse: async (id) => {
    const response = await api.delete(`/api/course/deletecourse/${id}`);
    return response.data;
  }
};