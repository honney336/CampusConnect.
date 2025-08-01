import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaBullhorn,
  FaChartBar,
  FaUserPlus,
  FaPlus,
  FaEye,
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaStickyNote,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaArrowRight,
  FaCog,
  FaDatabase
} from 'react-icons/fa';
import { 
  getAllUsers, 
  getAllCourses, 
  getAllAnnouncements, 
  getAllEvents,
  getAllActivityLogs,
  getAllNotes,
  getAllEnrollments
} from '../../API/API';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
    totalEnrollments: 0,
    totalNotes: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, coursesRes, announcementsRes, eventsRes, notesRes, enrollmentsRes] = await Promise.allSettled([
        getAllUsers(),
        getAllCourses(),
        getAllAnnouncements(),
        getAllEvents(),
        getAllNotes(),
        getAllEnrollments()
      ]);

      let totalUsers = 0, totalStudents = 0, totalFaculty = 0, totalAdmins = 0;
      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.success) {
        const users = usersRes.value.data.users || [];
        totalUsers = users.length;
        totalStudents = users.filter(user => user.role === 'student').length;
        totalFaculty = users.filter(user => user.role === 'faculty').length;
        totalAdmins = users.filter(user => user.role === 'admin').length;
      }

      const totalCourses = coursesRes.status === 'fulfilled' && coursesRes.value?.data?.success 
        ? (coursesRes.value.data.courses?.length || 0) : 0;

      const totalAnnouncements = announcementsRes.status === 'fulfilled' && announcementsRes.value?.data?.success 
        ? (announcementsRes.value.data.announcements?.length || 0) : 0;

      const totalEvents = eventsRes.status === 'fulfilled' && eventsRes.value?.data?.success 
        ? (eventsRes.value.data.events?.length || 0) : 0;

      const totalNotes = notesRes.status === 'fulfilled' && notesRes.value?.data?.success 
        ? (notesRes.value.data.notes?.length || 0) : 0;

      const totalEnrollments = enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data?.success 
        ? (enrollmentsRes.value.data.enrollments?.length || 0) : 0;

      setStats({
        totalUsers,
        totalStudents,
        totalFaculty,
        totalAdmins,
        totalCourses,
        totalAnnouncements,
        totalEvents,
        totalEnrollments,
        totalNotes
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await getAllActivityLogs();
      if (response?.data?.success) {
        // Get the last 5 activities
        const activities = response.data.logs.slice(0, 5).map(log => ({
          icon: getActivityIcon(log.action, log.entityType),
          text: formatActivityDescription(log.action, log.entityType, log.description),
          user: log.user,
          time: new Date(log.timestamp).toLocaleDateString(),
          userRole: log.userRole
        }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to empty array if API fails
      setRecentActivities([]);
    }
  };

  const getActivityIcon = (action, entityType) => {
    if (action === 'login' || action === 'login_failed') return FaUserGraduate;
    if (entityType === 'announcement') return FaBullhorn;
    if (entityType === 'course') return FaBook;
    if (entityType === 'event') return FaCalendarAlt;
    if (entityType === 'notes') return FaStickyNote;
    if (entityType === 'enrollment') return FaClipboardList;
    if (entityType === 'user') return FaUsers;
    return FaDatabase;
  };

  const formatActivityDescription = (action, entityType, description) => {
    if (description) return description;
    
    // Generate meaningful descriptions based on action and entity type
    if (action === 'login') return 'User logged in successfully';
    if (action === 'login_failed') return 'Failed login attempt';
    if (action === 'CREATE' && entityType === 'announcement') return 'Created new announcement';
    if (action === 'CREATE' && entityType === 'course') return 'Created new course';
    if (action === 'CREATE' && entityType === 'event') return 'Created new event';
    if (action === 'UPDATE' && entityType === 'user') return 'Updated user profile';
    if (action === 'DELETE' && entityType === 'user') return 'Deleted user account';
    
    return `${action} ${entityType}`;
  };

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, monitor system activity, and oversee campus operations</p>
          </div>
          <button
            onClick={() => navigate('/user-management')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <FaUserPlus className="mr-2" />
            Manage Users
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalStudents} Students • {stats.totalFaculty} Faculty • {stats.totalAdmins} Admins
                </div>
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FaBook className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
            </div>
          </div>

          {/* Enrollments */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <FaClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                <p className="text-sm text-gray-600">Enrollments</p>
              </div>
            </div>
          </div>

          {/* Course Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <FaStickyNote className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
                <p className="text-sm text-gray-600">Course Notes</p>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-teal-100">
                <FaCalendarAlt className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-sm text-gray-600">Events</p>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <FaBullhorn className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
                <p className="text-sm text-gray-600">Announcements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={() => navigate('/activity-logs')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <activity.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.text}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} ({activity.userRole}) • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaDatabase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Activity will appear here as users interact with the system.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/user-management')}
                    className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaUsers className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-900">Manage Users</span>
                  </button>

                  <button
                    onClick={() => navigate('/user-management')}
                    className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaUserPlus className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">Create User</span>
                  </button>

                  <button
                    onClick={() => navigate('/courses')}
                    className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <FaBook className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">View Courses</span>
                  </button>

                  <button
                    onClick={() => navigate('/activity-logs')}
                    className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <FaChartBar className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-900">Activity Logs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

