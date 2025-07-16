import api from './api';

export const notesService = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/api/notes/all');
    return response.data;
  },

  // Get course notes
  getCourseNotes: async (courseId) => {
    const response = await api.get(`/api/notes/course/${courseId}`);
    return response.data;
  },

  // Get my notes (faculty/admin)
  getMyNotes: async () => {
    const response = await api.get('/api/notes/my-notes');
    return response.data;
  },

  // Upload notes (faculty/admin)
  uploadNotes: async (formData) => {
    const response = await api.post('/api/notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update notes (faculty/admin)
  updateNotes: async (id, notesData) => {
    const response = await api.put(`/api/notes/update/${id}`, notesData);
    return response.data;
  },

  // Delete notes (faculty/admin)
  deleteNotes: async (id) => {
    const response = await api.delete(`/api/notes/delete/${id}`);
    return response.data;
  },

  // Download notes
  downloadNotes: async (id) => {
    const response = await api.get(`/api/notes/download/${id}`, {
      responseType: 'blob',
    });
    return response;
  }
};