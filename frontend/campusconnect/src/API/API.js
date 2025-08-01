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

// Notes endpoints
export const getAllNotes = async () => {
  try {
    const response = await Api.get('/api/notes/all');
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getCourseNotes = async (courseId) => {
  try {
    const response = await Api.get(`/api/notes/course/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course notes:', error);
    throw error;
  }
};

export const uploadNote = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await ApiFormData.post('/api/notes/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Role': user.role || '',
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Error uploading note:', error.response?.data || error);
    throw error;
  }
};

export const downloadNote = async (noteId) => {
  try {
    const response = await Api.get(`/api/notes/download/${noteId}`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error downloading note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await Api.delete(`/api/notes/delete/${noteId}`);
    return response;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Enrollment endpoints - Fixed to match actual backend routes
export const getAllEnrollments = async () => {
  try {
    const response = await Api.get('/api/enrollment/all-enrollments');
    return response;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const getStudentEnrollments = async () => {
  try {
    const response = await Api.get('/api/enrollment/enrollments');
    
    // Log the actual response to debug
    console.log('Student enrollments API response:', response.data);
    
    // Return the response as-is since it's working
    return response;
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    throw error; // Don't mask the error, let it be handled properly
  }
};

export const getCourseEnrollments = async (courseId) => {
  try {
    const response = await Api.get(`/api/enrollment/course-enrollments/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

export const enrollStudent = async (data) => {
  try {
    const response = await Api.post('/api/enrollment/enroll', data);
    return response;
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
};

export const removeEnrollment = async (enrollmentId) => {
  try {
    const response = await Api.delete(`/api/enrollment/remove-enrollment/${enrollmentId}`);
    return response;
  } catch (error) {
    console.error('Error removing enrollment:', error);
    throw error;
  }
};

// Announcement endpoints
export const getCourseAnnouncements = async (courseId) => {
    try {
        const response = await Api.get(`/api/announcement/course/${courseId}`);
        return response;
    } catch (error) {
        console.error('Error fetching course announcements:', error);
        throw error;
    }
};

export const getMyAnnouncements = async () => {
    try {
        const response = await Api.get('/api/announcement/my-announcements');
        return response;
    } catch (error) {
        console.error('Error fetching your announcements:', error);
        throw error;
    }
};

export const updateAnnouncement = async (id, data) => {
    try {
        const response = await Api.put(`/api/announcement/update/${id}`, data);
        return response;
    } catch (error) {
        console.error('Error updating announcement:', error);
        throw error;
    }
};

export const deleteAnnouncement = async (id) => {
    try {
        const response = await Api.delete(`/api/announcement/delete/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error;
    }
};

// Fix the baseURL - change from frontend port to backend port
const baseURL = "http://localhost:5000" // Change this to your actual backend port

// Helper function to get token (add this if it's missing)
const getToken = () => {
  return localStorage.getItem("token");
};

// Activity Log APIs - Updated to match server routes with hyphens
export const getAllActivityLogs = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/activity-log/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    if (error.response?.status === 404) {
      throw new Error("Activity logs endpoint not found. Please check if the backend route is properly configured.");
    }
    throw error;
  }
};

export const getActivityLogStats = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/activity-log/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching activity log stats:", error);
    throw error;
  }
};

export const getActivityLogsByEntityType = async (entityType) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/activity-log/entity/${entityType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching activity logs by entity type:", error);
    throw error;
  }
};

export const getUserActivityLogs = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/activity-log/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    throw error;
  }
};

export const getMyActivityLogs = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/activity-log/my-logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching my activity logs:", error);
    throw error;
  }
};

export const deleteOldActivityLogs = async (days) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.delete(`${baseURL}/api/activity-log/cleanup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { days },
    });
    return response;
  } catch (error) {
    console.error("Error deleting old activity logs:", error);
    throw error;
  }
};

// User Management APIs
export const getAllUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/auth/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get(`${baseURL}/api/auth/searchuser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.put(`${baseURL}/api/auth/update/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.delete(`${baseURL}/api/auth/deleteUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.post(`${baseURL}/api/auth/register`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

