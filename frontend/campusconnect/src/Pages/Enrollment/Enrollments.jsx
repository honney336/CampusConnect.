import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaUser, 
  FaCalendarAlt, 
  FaGraduationCap,
  FaInfoCircle,
  FaClipboardList,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import { getStudentEnrollments, getAllEnrollments } from '../../API/API';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(userData.role || '');
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user role from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'admin';
      
      console.log('Fetching enrollments for user role:', user.role);
      
      // Use different API calls based on user role
      const response = isAdmin ? await getAllEnrollments() : await getStudentEnrollments();
      console.log('Enrollments API response:', response.data);
      
      // Parse response based on API format
      if (response?.data?.success && response?.data?.enrollments) {
        const enrollmentData = response.data.enrollments;
        console.log('Parsed enrollment data:', enrollmentData);
        setEnrollments(enrollmentData);
      } else {
        console.warn('No enrollments found or API response format issue');
        setEnrollments([]);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load enrollments');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading enrollments...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
              <p className="text-gray-600 mt-1">Manage student course enrollments</p>
            </div>
            
            {(userRole === 'admin' || userRole === 'faculty') && (
              <button
                onClick={() => {
                  console.log('Navigate to enroll-student'); // Debug log
                  navigate('/enroll-student');
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaPlus className="mr-2" />
                Enroll Student
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Enrollments Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {enrollments.length > 0 ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FaClipboardList className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? 'All Enrollments' : 'Enrolled Courses'} ({enrollments.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      {/* Course Header */}
                      <div className="flex items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaBook className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {enrollment.course?.code || enrollment.code || 'Course Code'}
                          </h3>
                          <p className="text-lg text-gray-700 font-medium mb-2">
                            {enrollment.course?.title || enrollment.title || 'Course Title'}
                          </p>
                          
                          {/* Course Creator/Faculty */}
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FaUser className="w-4 h-4 mr-2" />
                            <span className="font-medium">Instructor: </span>
                            <span className="ml-1">
                              {enrollment.faculty || enrollment.course?.faculty?.username || 'Not Assigned'}
                            </span>
                          </div>

                          {/* Show student info for admin view */}
                          {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && enrollment.student && (
                            <div className="bg-blue-50 p-2 rounded-md mt-2">
                              <p className="text-sm text-blue-800 font-medium">
                                Student: {enrollment.student.username}
                              </p>
                              <p className="text-xs text-blue-600">
                                {enrollment.student.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span>Enrolled:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {(enrollment.course?.credit || enrollment.credit) && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaGraduationCap className="w-4 h-4 mr-2" />
                              <span>Credits:</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {enrollment.course?.credit || enrollment.credit}
                            </span>
                          </div>
                        )}

                        {/* Semester Info */}
                        {enrollment.semester && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaBook className="w-4 h-4 mr-2" />
                              <span>Semester:</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {enrollment.semester}
                            </span>
                          </div>
                        )}

                        {/* Course Description */}
                        {(enrollment.description || enrollment.course?.description) && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-start">
                              <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                              <p className="text-sm text-gray-700">
                                {enrollment.description || enrollment.course?.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="flex justify-center pt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FaUser className="w-3 h-3 mr-2" />
                            Enrolled
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? 'No enrollments found' : 'You are not enrolled in any courses'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' 
                  ? 'No student enrollments have been created yet.' 
                  : 'Contact your administrator or browse available courses to get started.'
                }
              </p>
            </div>
          )}
        </div>

        </div>
    </div>
  );
};

export default Enrollments;
