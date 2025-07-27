import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaBook, FaCalendarAlt, FaUserGraduate, FaChartLine, FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAllAnnouncements } from '../API/API';

const Homepage = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  console.log(token)
  console.log(userData)

  if (!token || !userData) {
    navigate('/login');
    return;
  }

  try {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser); // contains both name and role
  } catch (e) {
    console.error('Invalid user data', e);
    navigate('/login');
    return;
  }

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
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm"> */}
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <FaBook className="mr-2" /> CampusConnect
          </h1> */}
          {/* <div className="flex items-center space-x-4">
            <div className="relative"> */}
              {/* <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              /> */}
              {/* <FaSearch className="absolute left-3 top-3 text-gray-400" /> */}
            </div>
            {/* <button className="p-2 text-gray-600 hover:text-blue-600 relative">
              <FaBell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button> */}
            {/* <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <FaUserGraduate className="text-blue-600" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div> */}
          {/* </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
              
              <p className="mt-2">You have {assignments.filter(a => a.status !== 'Completed').length} pending tasks</p>
            </div>
            <FaChartLine className="h-12 w-12 opacity-70" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <FaBullhorn className="text-blue-500 mr-2" /> Announcements
                </h2>
                <button
                  onClick={() => navigate('/announcements')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-sm text-gray-500">No announcements found.</p>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="border-l-4 border-blue-400 pl-4 py-2 hover:bg-gray-50 rounded transition">
                      <h3 className="font-semibold text-lg truncate line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.content}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span className="max-w-[150px] truncate">Posted by {item.creator?.username || 'Unknown'}</span>
                        <span>{new Date(item.created_At).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" /> Upcoming Assignments
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
              </div>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border rounded-lg hover:shadow-xs transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        assignment.status === 'Started' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Due: {new Date(assignment.due).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courses Progress */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FaBook className="text-blue-500 mr-2" /> Your Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{course.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {course.instructor}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                      View Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;