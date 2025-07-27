import axios from 'axios';
const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Update the Api configuration
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user role to headers for backend role verification
    if (user.role) {
      config.headers['X-User-Role'] = user.role;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Update login endpoint with better error handling
export const login = async (data) => {
  try {
    const response = await Api.post('/api/user/login', data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createuser = (data) => Api.post('/api/auth/register', data);

export const getAllAnnouncements = async () => {
    try {
        const response = await Api.get('/api/announcement/all');
        return response;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
};

export const getAnnouncementById = async (id) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid announcement ID is required');
        }
        const response = await Api.get(`/api/announcement/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching announcement:', error);
        throw error;
    }
};

export const createAnnouncement = async (data) => {
    try {
        const response = await Api.post('/api/announcement/create', data);
        return response;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw error;
    }
};

export const changePassword = (data) => Api.post('/api/user/change-password', data, config);

// Event endpoints with fixed routes
export const getAllEvents = async () => {
  try {
    const response = await Api.get('/api/event/all');
    return response;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    if (!eventId) throw new Error('Event ID is required');
    const response = await Api.get(`/api/event/${eventId}`); // Updated path
    return response;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await Api.post('/api/event/create', data);
    return response;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, data) => {
  try {
    if (!id) throw new Error('Event ID is required');
    const response = await Api.put(`/api/event/${id}`, data); // Updated path
    return response;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    if (!id) throw new Error('Event ID is required');
    const response = await Api.delete(`/api/event/${id}`); // Updated path
    return response;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Course endpoints
export const getAllCourses = async () => {
  try {
    const response = await Api.get('/api/course/allcourses');
    return response;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await Api.get(`/api/course/course/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const createCourse = async (data) => {
  try {
    const response = await Api.post('/api/course/createcourse', data);
    return response;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, data) => {
  try {
    const response = await Api.put(`/api/course/updatecourse/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await Api.delete(`/api/course/deletecourse/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};


