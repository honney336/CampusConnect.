import api from './api';

export const announcementService = {
  // Get all announcements
  getAllAnnouncements: async () => {
    const response = await api.get('/api/announcement/all');
    return response.data;
  },

  // Get announcement by ID
  getAnnouncementById: async (id) => {
    const response = await api.get(`/api/announcement/${id}`);
    return response.data;
  },

  // Get course announcements
  getCourseAnnouncements: async (courseId) => {
    const response = await api.get(`/api/announcement/course/${courseId}`);
    return response.data;
  },

  // Get my announcements (faculty/admin)
  getMyAnnouncements: async () => {
    const response = await api.get('/api/announcement/my-announcements');
    return response.data;
  },

  // Create announcement (faculty/admin)
  createAnnouncement: async (announcementData) => {
    const response = await api.post('/api/announcement/create', announcementData);
    return response.data;
  },

  // Update announcement (faculty/admin)
  updateAnnouncement: async (id, announcementData) => {
    const response = await api.put(`/api/announcement/update/${id}`, announcementData);
    return response.data;
  },

  // Delete announcement (faculty/admin)
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/api/announcement/delete/${id}`);
    return response.data;
  }
};