import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaBullhorn,
  FaCalendarAlt,
  FaStickyNote,
  FaUserGraduate,
  FaClipboardList,
  FaEye,
  FaDownload,
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  getAllAnnouncements,
  getAllEvents,
  getAllCourses,
  getAllNotes,
  getStudentEnrollments
} from '../../API/API';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    announcements: [],
    events: [],
    courses: [],
    notes: [],
    enrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [announcementsRes, eventsRes, coursesRes, notesRes, enrollmentsRes] = await Promise.allSettled([
        getAllAnnouncements(),
        getAllEvents(),
        getAllCourses(),
        getAllNotes(),
        getStudentEnrollments()
      ]);

      const announcements = announcementsRes.status === 'fulfilled' && announcementsRes.value?.data?.success 
        ? (announcementsRes.value.data.announcements?.slice(0, 5) || []) : [];

      const events = eventsRes.status === 'fulfilled' && eventsRes.value?.data?.success 
        ? (eventsRes.value.data.events?.slice(0, 4) || []) : [];

      const courses = coursesRes.status === 'fulfilled' && coursesRes.value?.data?.success 
        ? (coursesRes.value.data.courses?.slice(0, 6) || []) : [];

      const notes = notesRes.status === 'fulfilled' && notesRes.value?.data?.success 
        ? (notesRes.value.data.notes?.slice(0, 4) || []) : [];

      // Fix enrollment parsing - the API is working, we just need to parse correctly
      let enrollments = [];
      if (enrollmentsRes.status === 'fulfilled') {
        console.log('Enrollments response:', enrollmentsRes.value?.data);
        
        if (enrollmentsRes.value?.data?.success && enrollmentsRes.value?.data?.enrollments) {
          enrollments = enrollmentsRes.value.data.enrollments;
          console.log('Parsed enrollments:', enrollments);
        }
      } else {
        console.warn('Failed to load enrollments:', enrollmentsRes.reason);
      }

      setStudentData({
        announcements,
        events,
        courses,
        notes,
        enrollments
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your courses</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{studentData.enrollments.length}</p>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <FaBullhorn className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{studentData.announcements.length}</p>
                <p className="text-sm text-gray-600">Recent Announcements</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <FaStickyNote className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{studentData.notes.length}</p>
                <p className="text-sm text-gray-600">Available Notes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-teal-100">
                <FaCalendarAlt className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{studentData.events.length}</p>
                <p className="text-sm text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                  <button
                    onClick={() => navigate('/announcements')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                {studentData.announcements.length > 0 ? (
                  <div className="space-y-4">
                    {studentData.announcements.map((announcement, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <FaClock className="mr-1" />
                          {new Date(announcement.created_At).toLocaleDateString()}
                          {announcement.course && (
                            <>
                              <span className="mx-2">•</span>
                              <FaBook className="mr-1" />
                              {announcement.course.code}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBullhorn className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
                    <p className="mt-1 text-sm text-gray-500">Check back later for updates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/courses')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaBook className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-900">Browse Courses</span>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => navigate('/notes')}
                    className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaStickyNote className="w-5 h-5 text-orange-600 mr-3" />
                      <span className="font-medium text-orange-900">View Notes</span>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-orange-600" />
                  </button>

                  <button
                    onClick={() => navigate('/events')}
                    className="w-full flex items-center justify-between p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-5 h-5 text-teal-600 mr-3" />
                      <span className="font-medium text-teal-900">Check Events</span>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-teal-600" />
                  </button>

                  <button
                    onClick={() => navigate('/enrollments')}
                    className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaClipboardList className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-900">My Enrollments</span>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                  <button
                    onClick={() => navigate('/events')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                {studentData.events.length > 0 ? (
                  <div className="space-y-3">
                    {studentData.events.slice(0, 3).map((event, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <FaMapMarkerAlt className="mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaCalendarAlt className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Available Notes and Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Available Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
                <button
                  onClick={() => navigate('/notes')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {studentData.notes.length > 0 ? (
                <div className="space-y-3">
                  {studentData.notes.map((note, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <FaStickyNote className="w-4 h-4 text-orange-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{note.title}</p>
                          <p className="text-xs text-gray-500">{note.course?.code || 'General'}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaStickyNote className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notes available</h3>
                  <p className="mt-1 text-sm text-gray-500">Notes will appear here when uploaded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Courses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Available Courses</h2>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {studentData.courses.length > 0 ? (
                <div className="space-y-3">
                  {studentData.courses.slice(0, 4).map((course, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{course.code}</h4>
                      <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.credits} Credits</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBook className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
                  <p className="mt-1 text-sm text-gray-500">Courses will appear here when added.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
