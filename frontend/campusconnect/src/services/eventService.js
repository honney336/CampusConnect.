import api from './api';

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    const response = await api.get('/api/event/all');
    return response.data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await api.get(`/api/event/event/${id}`);
    return response.data;
  },

  // Get course events
  getCourseEvents: async (courseId) => {
    const response = await api.get(`/api/event/course/${courseId}`);
    return response.data;
  },

  // Get my events (faculty/admin)
  getMyEvents: async () => {
    const response = await api.get('/api/event/my-events');
    return response.data;
  },

  // Create event (faculty/admin)
  createEvent: async (eventData) => {
    const response = await api.post('/api/event/create', eventData);
    return response.data;
  },

  // Update event (faculty/admin)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/api/event/update/${id}`, eventData);
    return response.data;
  },

  // Delete event (faculty/admin)
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/event/delete/${id}`);
    return response.data;
  }
};