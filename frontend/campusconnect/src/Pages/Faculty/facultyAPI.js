import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  };
};

// Faculty Courses API
export const getFacultyCourses = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/course/faculty-courses`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    throw error;
  }
};

// Faculty Announcements API
export const getFacultyAnnouncements = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/announcement/my-announcements`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching faculty announcements:', error);
    throw error;
  }
};

// Faculty Events API
export const getFacultyEvents = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/event/my-events`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching faculty events:', error);
    throw error;
  }
};

// Faculty Stats API (if backend supports it)
export const getFacultyStats = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/faculty/stats`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    throw error;
  }
};

// Get faculty course enrollments
export const getFacultyCourseEnrollments = async (courseId) => {
  try {
    const response = await axios.get(`${baseURL}/api/enrollment/course/${courseId}`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

// Get faculty notes
export const getFacultyNotes = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/notes/my-notes`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error fetching faculty notes:', error);
    throw error;
  }
};
