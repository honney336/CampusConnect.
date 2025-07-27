import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaGraduationCap, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
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

  if (loading) return <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Only show create button for admin and faculty */}
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          {(userRole === 'admin' || userRole === 'faculty') && (
            <button
              onClick={() => navigate('/create-course')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Create Course
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                {/* Course title and code */}
                <div>
                  <div className="flex items-center">
                    <FaBook className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold">{course.code}</h3>
                  </div>
                  <h4 className="text-xl mt-2">{course.title}</h4>
                </div>

                {/* Updated permission check for edit/delete buttons */}
                {canModifyCourse() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/update-course/${course.id}`)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                      title="Edit course"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                      title="Delete course"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Course details */}
              <p className="mt-3 text-gray-600">{course.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {course.credit} Credits
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  Semester {course.semester}
                </span>
              </div>

              {course.faculty && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <FaGraduationCap className="mr-2" />
                  <span>Instructor: {course.faculty.username}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;