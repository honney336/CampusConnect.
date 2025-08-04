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

// Helper function to get current user
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

// Faculty Courses API with multiple endpoint attempts
export const getFacultyCourses = async () => {
  const user = getCurrentUser();
  console.log('🔍 Fetching faculty courses for user:', user.id);
  
  const endpoints = [
    `${baseURL}/api/course/faculty-courses`,
    `${baseURL}/api/courses/faculty`,
    `${baseURL}/api/courses/my-courses`,
    `${baseURL}/api/courses`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, { headers: getAuthHeaders() });
      
      if (response.data?.courses?.length > 0) {
        console.log(`✅ Success with ${endpoint}:`, response.data.courses.length, 'courses');
        return response;
      }
      
      // If general courses endpoint, filter for faculty
      if (endpoint.includes('/api/courses') && !endpoint.includes('faculty')) {
        const allCourses = response.data?.courses || [];
        const facultyCourses = allCourses.filter(course => 
          course.createdBy === user.id || 
          course.instructorId === user.id ||
          course.instructor === user.username
        );
        
        if (facultyCourses.length > 0) {
          console.log(`✅ Filtered courses for faculty:`, facultyCourses.length);
          return { ...response, data: { ...response.data, courses: facultyCourses } };
        }
      }
    } catch (error) {
      console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status);
      continue;
    }
  }
  
  console.log('⚠️ No courses found from any endpoint');
  return { data: { courses: [] } };
};

// Faculty Announcements API with multiple endpoint attempts
export const getAllAnnouncements = async () => {
  const user = getCurrentUser();
  console.log('🔍 Fetching faculty announcements for user:', user.id);
  
  const endpoints = [
    `${baseURL}/api/announcement/my-announcements`,
    `${baseURL}/api/announcements/faculty`,
    `${baseURL}/api/announcements/my`,
    `${baseURL}/api/announcements`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, { headers: getAuthHeaders() });
      
      if (response.data?.announcements?.length > 0) {
        console.log(`✅ Success with ${endpoint}:`, response.data.announcements.length, 'announcements');
        return response;
      }
      
      // If general announcements endpoint, filter for faculty
      if (endpoint.includes('/api/announcements') && !endpoint.includes('faculty') && !endpoint.includes('my')) {
        const allAnnouncements = response.data?.announcements || [];
        const facultyAnnouncements = allAnnouncements.filter(announcement => 
          announcement.createdBy === user.id || announcement.creator?.id === user.id
        );
        
        if (facultyAnnouncements.length > 0) {
          console.log(`✅ Filtered announcements for faculty:`, facultyAnnouncements.length);
          return { ...response, data: { ...response.data, announcements: facultyAnnouncements } };
        }
      }
    } catch (error) {
      console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status);
      continue;
    }
  }
  
  console.log('⚠️ No announcements found from any endpoint');
  return { data: { announcements: [] } };
};

// Faculty Events API with multiple endpoint attempts
export const getFacultyEvents = async () => {
  const user = getCurrentUser();
  console.log('🔍 Fetching faculty events for user:', user.id);
  
  const endpoints = [
    `${baseURL}/api/event/my-events`,
    `${baseURL}/api/events/faculty`,
    `${baseURL}/api/events/my`,
    `${baseURL}/api/events`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, { headers: getAuthHeaders() });
      
      if (response.data?.events?.length > 0) {
        console.log(`✅ Success with ${endpoint}:`, response.data.events.length, 'events');
        return response;
      }
      
      // If general events endpoint, filter for faculty
      if (endpoint.includes('/api/events') && !endpoint.includes('faculty') && !endpoint.includes('my')) {
        const allEvents = response.data?.events || [];
        const facultyEvents = allEvents.filter(event => 
          event.createdBy === user.id || event.organizer === user.username
        );
        
        if (facultyEvents.length > 0) {
          console.log(`✅ Filtered events for faculty:`, facultyEvents.length);
          return { ...response, data: { ...response.data, events: facultyEvents } };
        }
      }
    } catch (error) {
      console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status);
      continue;
    }
  }
  
  console.log('⚠️ No events found from any endpoint');
  return { data: { events: [] } };
};

// Faculty Notes API with multiple endpoint attempts
export const getFacultyNotes = async () => {
  const user = getCurrentUser();
  console.log('🔍 Fetching faculty notes for user:', user.id);
  
  const endpoints = [
    `${baseURL}/api/notes/my-notes`,
    `${baseURL}/api/notes/faculty`,
    `${baseURL}/api/notes`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, { headers: getAuthHeaders() });
      
      if (response.data?.notes?.length > 0) {
        console.log(`✅ Success with ${endpoint}:`, response.data.notes.length, 'notes');
        return response;
      }
      
      // If general notes endpoint, filter for faculty
      if (endpoint.includes('/api/notes') && !endpoint.includes('faculty') && !endpoint.includes('my')) {
        const allNotes = response.data?.notes || [];
        const facultyNotes = allNotes.filter(note => 
          note.uploadedBy === user.id || note.uploader?.id === user.id
        );
        
        if (facultyNotes.length > 0) {
          console.log(`✅ Filtered notes for faculty:`, facultyNotes.length);
          return { ...response, data: { ...response.data, notes: facultyNotes } };
        }
      }
    } catch (error) {
      console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status);
      continue;
    }
  }
  
  console.log('⚠️ No notes found from any endpoint');
  return { data: { notes: [] } };
};

// Faculty Enrollments - Get from courses
export const getFacultyEnrollments = async () => {
  try {
    console.log('🔍 Fetching faculty enrollments...');
    
    // First get faculty courses
    const coursesResponse = await getFacultyCourses();
    const courses = coursesResponse.data?.courses || [];
    
    if (courses.length === 0) {
      console.log('⚠️ No courses found, no enrollments to fetch');
      return { data: { enrollments: [] } };
    }

    // Try to get enrollments for each course
    const allEnrollments = [];
    
    for (const course of courses) {
      try {
        const enrollmentResponse = await axios.get(`${baseURL}/api/enrollment/course-enrollments/${course.id}`, {
          headers: getAuthHeaders()
        });
        
        const courseEnrollments = enrollmentResponse.data?.enrollments || [];
        courseEnrollments.forEach(enrollment => {
          allEnrollments.push({
            ...enrollment,
            course: course,
            courseCode: course.courseCode,
            courseTitle: course.title
          });
        });
      } catch (error) {
        console.log(`⚠️ Failed to get enrollments for course ${course.id}`);
      }
    }

    console.log(`✅ Found ${allEnrollments.length} total enrollments`);
    return { data: { enrollments: allEnrollments } };
    
  } catch (error) {
    console.error('❌ Error fetching faculty enrollments:', error);
    return { data: { enrollments: [] } };
  }
};

// Faculty Stats API
export const getFacultyStats = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/faculty/stats`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.log('⚠️ Faculty stats endpoint not available');
    throw error;
  }
};

// Get enrollments for a specific course
export const getFacultyCourseEnrollments = async (courseId) => {
  try {
    console.log(`🔍 Fetching enrollments for course ${courseId}...`);
    const response = await axios.get(`${baseURL}/api/enrollment/course-enrollments/${courseId}`, {
      headers: getAuthHeaders()
    });
    console.log('Course enrollments response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

export const getFacultyAnnouncementsAlt = async () => {
  try {
    console.log('Fetching announcements (alternative)...');
    const response = await axios.get(`${baseURL}/api/announcements`, {
      headers: getAuthHeaders()
    });
    console.log('All announcements response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

export const getFacultyNotesAlt = async () => {
  try {
    console.log('Fetching notes (alternative)...');
    const response = await axios.get(`${baseURL}/api/notes`, {
      headers: getAuthHeaders()
    });
    console.log('All notes response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};
