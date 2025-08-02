// Safe localStorage operations with error handling
export const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  getUser: () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      // Validate user structure
      if (!user || typeof user !== 'object' || !user.id) {
        throw new Error('Invalid user data structure');
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (!user || typeof user !== 'object' || !user.id) {
        throw new Error('Invalid user data');
      }
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  },

  clearAuth: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }
};
