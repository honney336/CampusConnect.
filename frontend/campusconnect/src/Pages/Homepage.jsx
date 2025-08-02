import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaBook, FaCalendarAlt, FaUserGraduate, FaChartLine, FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAllAnnouncements } from '../API/API';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log('Current user:', parsedUser); // Debug log
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllAnnouncements();
        if (response?.data?.success && Array.isArray(response.data.announcements)) {
          setAnnouncements(response.data.announcements.slice(0, 3)); // Only show first 3
        }
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      }

      // Courses and Assignments mock data
      setCourses([
        { id: 1, name: 'Mathematics 101', progress: 65, instructor: 'Prof. Lee' },
        { id: 2, name: 'Literature', progress: 40, instructor: 'Dr. Adams' },
        { id: 3, name: 'Computer Science', progress: 82, instructor: 'Prof. Chen' }
      ]);

      setAssignments([
        { id: 1, course: 'Mathematics 101', title: 'Chapter 5 Problems', due: '2023-11-20', status: 'Pending' },
        { id: 2, course: 'Literature', title: 'Essay Draft', due: '2023-11-22', status: 'Started' },
        { id: 3, course: 'Computer Science', title: 'Python Project', due: '2023-11-25', status: 'Not Started' }
      ]);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  // Helper function for permission checks
  const hasPermission = (action) => {
    if (!user) return false;
    
    switch (action) {
      case 'create':
        return ['admin', 'faculty'].includes(user.role);
      case 'edit':
        return ['admin', 'faculty'].includes(user.role);
      case 'delete':
        return ['admin', 'faculty'].includes(user.role);
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-blue-200 rounded mb-4 mx-auto"></div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Technology Driving
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Student Success
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                Building a culture of data use in schools
              </p>
              <p className="text-lg text-blue-200 mb-8">
                Welcome back, <span className="font-semibold text-white">{user?.name}</span>! 
                You have {assignments.filter(a => a.status !== 'Completed').length} pending tasks
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
                >
                  View Courses
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <FaBook className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-sm text-blue-100">Active Courses</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <FaUserGraduate className="h-8 w-8 mx-auto mb-2 text-green-300" />
                    <div className="text-2xl font-bold">{assignments.length}</div>
                    <div className="text-sm text-blue-100">Assignments</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <FaBullhorn className="h-8 w-8 mx-auto mb-2 text-pink-300" />
                    <div className="text-2xl font-bold">{announcements.length}</div>
                    <div className="text-sm text-blue-100">Announcements</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <FaChartLine className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-blue-100">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <FaBook className="text-blue-600 h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-800">My Courses</h3>
            <p className="text-sm text-gray-500 mt-1">View all courses</p>
          </button>
          
          <button
            onClick={() => navigate('/announcements')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <FaBullhorn className="text-purple-600 h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Announcements</h3>
            <p className="text-sm text-gray-500 mt-1">Latest updates</p>
          </button>
          
          <button
            onClick={() => navigate('/events')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <FaCalendarAlt className="text-green-600 h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Events</h3>
            <p className="text-sm text-gray-500 mt-1">Upcoming events</p>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <FaUserGraduate className="text-orange-600 h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Manage account</p>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center text-gray-800">
                  <div className="bg-blue-100 p-2 rounded-xl mr-3">
                    <FaBullhorn className="text-blue-600 h-5 w-5" />
                  </div>
                  Latest Announcements
                </h2>
                <button
                  onClick={() => navigate('/announcements')}
                  className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBullhorn className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No announcements found.</p>
                  </div>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.content}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {item.creator?.username || 'Unknown'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(item.created_At).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center text-gray-800">
                  <div className="bg-green-100 p-2 rounded-xl mr-3">
                    <FaCalendarAlt className="text-green-600 h-5 w-5" />
                  </div>
                  Upcoming Tasks
                </h2>
              </div>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        assignment.status === 'Started' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{assignment.course}</p>
                    <div className="text-xs text-gray-400">
                      Due: {new Date(assignment.due).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Progress */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
              <div className="bg-purple-100 p-2 rounded-xl mr-3">
                <FaBook className="text-purple-600 h-5 w-5" />
              </div>
              Your Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-800 text-lg">{course.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {course.instructor}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2 text-gray-600">
                      <span>Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="w-full py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin/Faculty Actions */}
        {hasPermission('create') && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/createannouncement')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Announcement
              </button>
              <button
                onClick={() => navigate('/create-event')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Event
              </button>
              <button
                onClick={() => navigate('/create-course')}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Course
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
