import api from './api';

export const userService = {
  // Get all users (admin)
  getAllUsers: async () => {
    const response = await api.get('/api/auth/getuser');
    return response.data;
  },

  // Create user (admin)
  createUser: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Update user (admin)
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/auth/update/${id}`, userData);
    return response.data;
  },

  // Delete user (admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/api/auth/deleteUser/${id}`);
    return response.data;
  },

  // Get user by ID (admin)
  getUserById: async (id) => {
    const response = await api.get(`/api/auth/searchuser/${id}`);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/api/user/change-password', {
      oldpassword: oldPassword,
      newpassword: newPassword
    });
    return response.data;
  }
};