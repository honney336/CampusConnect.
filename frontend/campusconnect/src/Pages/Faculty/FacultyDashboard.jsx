import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaUsers,
  FaStickyNote,
  FaBullhorn,
  FaCalendarAlt,
  FaGraduationCap,
  FaPlus,
  FaEye,
  FaUserCheck,
  FaFileUpload
} from 'react-icons/fa';
import { 
  getFacultyCourses, 
  getFacultyAnnouncements, 
  getFacultyEvents,
  getFacultyStats,
  getFacultyEnrollments,
  getFacultyNotes
} from './facultyAPI';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    announcements: 0,
    events: 0,
    totalStudents: 0,
    notes: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  setUser(userData);
  if (userData?.id) {
    fetchFacultyData(userData);
  }
}, []);

const fetchFacultyData = async (userData) => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token || !userData.id) {
      console.error('❌ No authentication data found');
      navigate('/login');
      return;
    }

    console.log('🔄 Fetching faculty data for user:', userData.username);

    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled([
      getFacultyCourses(),
      getFacultyAnnouncements(),
      getFacultyEvents(),
      getFacultyEnrollments(),
      getFacultyNotes()
    ]);

    console.log('📊 API Results:', results);

    // Extract data from successful calls
    const courses = results[0].status === 'fulfilled' ? results[0].value?.data?.courses || [] : [];
    const announcements = results[1].status === 'fulfilled' ? results[1].value?.data?.announcements || [] : [];
    const events = results[2].status === 'fulfilled' ? results[2].value?.data?.events || [] : [];
    const enrollments = results[3].status === 'fulfilled' ? results[3].value?.data?.enrollments || [] : [];
    const notes = results[4].status === 'fulfilled' ? results[4].value?.data?.notes || [] : [];

    console.log('📈 Final counts:');
    console.log(`- Courses: ${courses.length}`);
    console.log(`- Announcements: ${announcements.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Enrollments: ${enrollments.length}`);
    console.log(`- Notes: ${notes.length}`);

    // If announcements and events failed, try direct API calls with manual filtering
    let finalAnnouncements = announcements;
    let finalEvents = events;

    if (announcements.length === 0) {
      try {
        console.log('🔄 Trying direct announcements call...');
        const directAnnouncementRes = await axios.get('http://localhost:5000/api/announcement', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allAnnouncements = directAnnouncementRes.data?.announcements || [];
        finalAnnouncements = allAnnouncements.filter(ann => 
          ann.createdBy === userData.id || ann.creator?.id === userData.id
        );
        console.log(`✅ Found ${finalAnnouncements.length} announcements via direct call`);
      } catch (directError) {
        console.log('❌ Direct announcements call also failed');
      }
    }

    if (events.length === 0) {
      try {
        console.log('🔄 Trying direct events call...');
        const directEventRes = await axios.get('http://localhost:5000/api/event', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allEvents = directEventRes.data?.events || [];
        finalEvents = allEvents.filter(event => 
          event.createdBy === userData.id || event.organizer === userData.username
        );
        console.log(`✅ Found ${finalEvents.length} events via direct call`);
      } catch (directError) {
        console.log('❌ Direct events call also failed');
      }
    }

    const finalStats = {
      courses: courses.length,
      announcements: finalAnnouncements.length,
      events: finalEvents.length,
      totalStudents: enrollments.length,
      notes: notes.length
    };

    console.log('🎯 Setting final stats:', finalStats);
    setStats(finalStats);
    setRecentEnrollments(enrollments.slice(0, 5));

    // Log what endpoints are working vs not working
    console.log('📋 API Endpoint Status:');
    console.log(`✅ Courses: Working (${courses.length} found)`);
    console.log(`${finalAnnouncements.length > 0 ? '✅' : '❌'} Announcements: ${finalAnnouncements.length > 0 ? 'Working' : 'No working endpoint found'} (${finalAnnouncements.length} found)`);
    console.log(`${finalEvents.length > 0 ? '✅' : '❌'} Events: ${finalEvents.length > 0 ? 'Working' : 'No working endpoint found'} (${finalEvents.length} found)`);
    console.log(`${enrollments.length > 0 ? '✅' : '❌'} Enrollments: ${enrollments.length > 0 ? 'Working' : 'No data'} (${enrollments.length} found)`);
    console.log(`✅ Notes: Working (${notes.length} found)`);

  } catch (error) {
    console.error('💥 Error loading faculty dashboard data:', error);
    setStats({
      courses: 0,
      announcements: 0,
      events: 0,
      totalStudents: 0,
      notes: 0
    });
    setRecentEnrollments([]);
  } finally {
    setLoading(false);
  }
};


  const quickActions = [
    {
      title: 'Create Course',
      description: 'Add a new course to your curriculum',
      icon: FaBook,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: () => navigate('/create-course')
    },
    {
      title: 'Upload Notes',
      description: 'Share course materials with students',
      icon: FaFileUpload,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      action: () => navigate('/upload-note')
    },
    {
      title: 'New Announcement',
      description: 'Post important information',
      icon: FaBullhorn,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      action: () => navigate('/createannouncement')
    },
    {
      title: 'Create Event',
      description: 'Schedule upcoming activities',
      icon: FaCalendarAlt,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      action: () => navigate('/create-event')
    },
    {
      title: 'Enroll Student',
      description: 'Add students to your courses',
      icon: FaUserCheck,
      color: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700',
      action: () => navigate('/enroll-student')
    }
  ];

  const navigationCards = [
    {
      title: 'My Courses',
      description: 'Manage your courses and view enrollments',
      icon: FaBook,
      count: stats.courses,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/courses')
    },
    {
      title: 'Student Enrollments',
      description: 'View and manage student enrollments',
      icon: FaUsers,
      count: stats.totalStudents,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/enrollments')
    },
    {
      title: 'Course Notes',  
      description: 'Upload and manage course materials',
      icon: FaStickyNote,
      count: stats.notes || 0, // Add fallback to 0
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/notes')
    },
    {
      title: 'My Announcements',
      description: 'View and edit your announcements',
      icon: FaBullhorn,
      count: stats.announcements,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/faculty/announcements')
    },
    {
      title: 'My Events',
      description: 'Manage your scheduled events',
      icon: FaCalendarAlt,
      count: stats.events,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: () => navigate('/faculty/events')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.username}! Manage your courses and engage with students.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBook className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaStickyNote className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Course Notes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notes || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaBullhorn className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Announcements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.announcements}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-colors flex flex-col items-center text-center`}
              >
                <action.icon className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">{action.title}</span>
                <span className="text-xs opacity-90 mt-1">{action.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Management Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationCards.map((card, index) => (
              <div
                key={index}
                onClick={card.action}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start">
                  <div className={`p-3 ${card.bgColor} rounded-lg`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                      <span className={`text-2xl font-bold ${card.color}`}>{card.count}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{card.description}</p>
                    <div className="mt-3">
                      <span className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <FaEye className="w-4 h-4 mr-1" />
                        View & Manage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Student Enrollments</h2>
            <button
              onClick={() => navigate('/enrollments')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View All <FaEye className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          {recentEnrollments.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentEnrollments.map((enrollment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUsers className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.student?.username || enrollment.studentEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                {enrollment.student?.email || enrollment.studentEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.course?.title || enrollment.courseCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.course?.courseCode || enrollment.courseCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Enrollments</h3>
              <p className="text-gray-500 mb-4">You haven't enrolled any students recently.</p>
              <button
                onClick={() => navigate('/enroll-student')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaUserCheck className="mr-2 h-4 w-4" />
                Enroll Student
              </button>
            </div>
          )}
        </div>

        {/* Faculty Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-6 h-6 text-blue-600 mr-2" />
            Faculty Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Course Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create and manage your courses</li>
                <li>• Upload course materials and notes</li>
                <li>• Monitor student enrollments</li>
                <li>• Update course information as needed</li>
                <li>• Enroll students in your courses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Post announcements for your courses</li>
                <li>• Schedule important events and deadlines</li>
                <li>• Share updates with enrolled students</li>
                <li>• Manage academic calendar events</li>
                <li>• Track student progress and attendance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
