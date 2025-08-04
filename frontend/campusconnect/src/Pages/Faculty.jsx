// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaBook,
//   FaUsers,
//   FaStickyNote,
//   FaBullhorn,
//   FaCalendarAlt,
//   FaGraduationCap,
//   FaChartBar,
//   FaPlus,
//   FaEye,
//   FaUserCheck,
//   FaFileUpload
// } from 'react-icons/fa';
// import { getAllCourses, getAllAnnouncements, getAllEvents } from '../API/API';

// const FacultyDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({
//     courses: 0,
//     announcements: 0,
//     events: 0,
//     totalStudents: 0
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('user') || '{}');
//     setUser(userData);
//   }, []);

//   // Separate useEffect for fetching stats after user is set
//   useEffect(() => {
//     if (user?.id) {
//       fetchFacultyStats();
//     }
//   }, [user]);

//   const fetchFacultyStats = async () => {
//     try {
//       setLoading(true);
      
//       console.log('Current user:', user); // Debug log
      
//       // Fetch all courses
//       const coursesRes = await getAllCourses();
//       const allCourses = coursesRes?.data?.courses || [];
//       console.log('API Response for courses:', coursesRes?.data);
//       console.log('All courses raw data:', allCourses);
      
//       // More comprehensive filtering for courses
//       const facultyCourses = allCourses.filter(course => {
//         console.log('Course data:', course);
//         console.log('Course faculty:', course.faculty);
//         console.log('Course facultyId:', course.facultyId);
        
//         const match = 
//           course.faculty?.id === user?.id || 
//           course.facultyId === user?.id ||
//           course.faculty?.username === user?.username ||
//           String(course.faculty?.id) === String(user?.id) ||
//           String(course.facultyId) === String(user?.id);
          
//         console.log(`Course ${course.title}: match=${match}`);
//         return match;
//       });
      
//       console.log('Faculty courses found:', facultyCourses);
      
//       // Fetch all announcements
//       const announcementsRes = await getAllAnnouncements();
//       const allAnnouncements = announcementsRes?.data?.announcements || [];
//       console.log('API Response for announcements:', announcementsRes?.data);
      
//       const facultyAnnouncements = allAnnouncements.filter(announcement => {
//         const match = 
//           announcement.createdBy === user?.id || 
//           announcement.creator?.id === user?.id ||
//           String(announcement.createdBy) === String(user?.id) ||
//           String(announcement.creator?.id) === String(user?.id);
          
//         return match;
//       });
      
//       console.log('Faculty announcements found:', facultyAnnouncements);
      
//       // Fetch all events
//       const eventsRes = await getAllEvents();
//       const allEvents = eventsRes?.data?.events || [];
//       console.log('API Response for events:', eventsRes?.data);
      
//       const facultyEvents = allEvents.filter(event => {
//         const match = 
//           event.createdBy === user?.id || 
//           event.creator?.id === user?.id ||
//           String(event.createdBy) === String(user?.id) ||
//           String(event.creator?.id) === String(user?.id);
          
//         return match;
//       });
      
//       console.log('Faculty events found:', facultyEvents);
      
//       // Calculate total students from course enrollments
//       const totalStudents = facultyCourses.reduce((total, course) => {
//         const enrollmentCount = course.enrollments?.length || 0;
//         console.log(`Course ${course.title} has ${enrollmentCount} enrollments`);
//         return total + enrollmentCount;
//       }, 0);

//       const newStats = {
//         courses: facultyCourses.length,
//         announcements: facultyAnnouncements.length,
//         events: facultyEvents.length,
//         totalStudents
//       };

//       console.log('Final calculated stats:', newStats);
//       setStats(newStats);
      
//     } catch (error) {
//       console.error('Error fetching faculty stats:', error);
//       setStats({
//         courses: 0,
//         announcements: 0,
//         events: 0,
//         totalStudents: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const quickActions = [
//     {
//       title: 'Create Course',
//       description: 'Add a new course to your curriculum',
//       icon: FaBook,
//       color: 'bg-blue-600',
//       hoverColor: 'hover:bg-blue-700',
//       action: () => navigate('/create-course')
//     },
//     {
//       title: 'Upload Notes',
//       description: 'Share course materials with students',
//       icon: FaFileUpload,
//       color: 'bg-green-600',
//       hoverColor: 'hover:bg-green-700',
//       action: () => navigate('/upload-note')
//     },
//     {
//       title: 'New Announcement',
//       description: 'Post important information',
//       icon: FaBullhorn,
//       color: 'bg-purple-600',
//       hoverColor: 'hover:bg-purple-700',
//       action: () => navigate('/createannouncement')
//     },
//     {
//       title: 'Create Event',
//       description: 'Schedule upcoming activities',
//       icon: FaCalendarAlt,
//       color: 'bg-orange-600',
//       hoverColor: 'hover:bg-orange-700',
//       action: () => navigate('/create-event')
//     },
//     {
//       title: 'Enroll Student',
//       description: 'Add students to your courses',
//       icon: FaUserCheck,
//       color: 'bg-teal-600',
//       hoverColor: 'hover:bg-teal-700',
//       action: () => navigate('/enroll-student')
//     }
//   ];

//   const navigationCards = [
//     {
//       title: 'My Courses',
//       description: 'Manage your courses and view enrollments',
//       icon: FaBook,
//       count: stats.courses,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//       action: () => navigate('/courses')
//     },
//     {
//       title: 'Student Enrollments',
//       description: 'View and manage student enrollments',
//       icon: FaUsers,
//       count: stats.totalStudents,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//       action: () => navigate('/enrollments')
//     },
//     {
//       title: 'Course Notes',
//       description: 'Upload and manage course materials',
//       icon: FaStickyNote,
//       count: '∞',
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50',
//       action: () => navigate('/notes')
//     },
//     {
//       title: 'My Announcements',
//       description: 'View and edit your announcements',
//       icon: FaBullhorn,
//       count: stats.announcements,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-50',
//       action: () => navigate('/announcements')
//     },
//     {
//       title: 'My Events',
//       description: 'Manage your scheduled events',
//       icon: FaCalendarAlt,
//       count: stats.events,
//       color: 'text-red-600',
//       bgColor: 'bg-red-50',
//       action: () => navigate('/events')
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <p className="ml-4">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Welcome back, <strong>{user?.username}!</strong> Manage your courses and engage with students.
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <FaBook className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">My Courses</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <FaUsers className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Students</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <FaBullhorn className="w-6 h-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Announcements</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.announcements}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-orange-100 rounded-lg">
//                 <FaCalendarAlt className="w-6 h-6 text-orange-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">My Events</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             {quickActions.map((action, index) => (
//               <button
//                 key={index}
//                 onClick={action.action}
//                 className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-colors flex flex-col items-center text-center`}
//               >
//                 <action.icon className="w-8 h-8 mb-2" />
//                 <span className="font-medium text-sm">{action.title}</span>
//                 <span className="text-xs opacity-90 mt-1">{action.description}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Navigation Cards */}
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Management Areas</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {navigationCards.map((card, index) => (
//               <div
//                 key={index}
//                 onClick={card.action}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
//               >
//                 <div className="flex items-start">
//                   <div className={`p-3 ${card.bgColor} rounded-lg`}>
//                     <card.icon className={`w-6 h-6 ${card.color}`} />
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
//                       <span className={`text-2xl font-bold ${card.color}`}>{card.count}</span>
//                     </div>
//                     <p className="text-gray-600 text-sm mt-1">{card.description}</p>
//                     <div className="mt-3">
//                       <span className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
//                         <FaEye className="w-4 h-4 mr-1" />
//                         View & Manage
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Faculty Guidelines */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//             <FaGraduationCap className="w-6 h-6 text-blue-600 mr-2" />
//             Faculty Guidelines
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-2">Course Management</h3>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Create and manage your courses</li>
//                 <li>• Upload course materials and notes</li>
//                 <li>• Monitor student enrollments</li>
//                 <li>• Update course information as needed</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Post announcements for your courses</li>
//                 <li>• Schedule important events and deadlines</li>
//                 <li>• Share updates with enrolled students</li>
//                 <li>• Manage academic calendar events</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FacultyDashboard;