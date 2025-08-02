import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarAlt, FaGraduationCap, FaPlus, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { getAllCourses, deleteCourse } from '../../API/API';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');

  // Updated permission check function
  const canModifyCourse = () => {
    return userRole === 'admin' || userRole === 'faculty';
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setUserRole(userData?.role || '');

    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        if (response?.data?.success) {
          setCourses(response.data.courses);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Updated delete handler with simplified permission check
  const handleDelete = async (courseId) => {
    if (!canModifyCourse()) {
      toast.error('You do not have permission to delete courses');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await deleteCourse(courseId);
      if (response.data.success) {
        toast.success('Course deleted successfully');
        setCourses(prev => prev.filter(course => course.id !== courseId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600 mt-1">Browse and manage available courses</p>
            </div>
            
            {(userRole === 'admin' || userRole === 'faculty') && (
              <button
                onClick={() => navigate('/create-course')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaPlus className="mr-2" />
                Create Course
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {courses.length > 0 ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FaBook className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Available Courses ({courses.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaBook className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {course.code}
                          </h3>
                          <p className="text-lg text-gray-700 font-medium mb-2">
                            {course.title}
                          </p>
                          
                          {course.faculty && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FaUser className="w-4 h-4 mr-2" />
                              <span className="font-medium">Instructor: </span>
                              <span className="ml-1">
                                {course.faculty.username}
                              </span>
                            </div>
                          )}

                          {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && course.faculty && (
                            <div className="bg-blue-50 p-2 rounded-md mt-2">
                              <p className="text-sm text-blue-800 font-medium">
                                Faculty: {course.faculty.username}
                              </p>
                              <p className="text-xs text-blue-600">
                                {course.faculty.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-200 pt-4 flex-grow">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaGraduationCap className="w-4 h-4 mr-2" />
                            <span>Credits:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {course.credit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span>Semester:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {course.semester}
                          </span>
                        </div>

                        {course.description && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-start">
                              <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                              <p className="text-sm text-gray-700">
                                {course.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {canModifyCourse() && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                          <button
                            onClick={() => navigate(`/update-course/${course.id}`)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <FaEdit className="w-4 h-4 mr-2" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(course.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaBook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Courses will appear here when created by faculty or administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;