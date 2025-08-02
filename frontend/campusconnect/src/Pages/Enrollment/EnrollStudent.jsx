import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { enrollStudent } from '../../API/API';
import toast from 'react-hot-toast';

const EnrollStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: '', // Changed from studentId to studentEmail
    courseCode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Enrolling student with data:', {
        studentEmail: formData.studentEmail.toLowerCase(),
        courseCode: formData.courseCode.toUpperCase()
      });
      
      console.log('Current user role:', JSON.parse(localStorage.getItem('user') || '{}').role);
      
      const response = await enrollStudent({
        studentEmail: formData.studentEmail.toLowerCase(),
        courseCode: formData.courseCode.toUpperCase()
      });
      
      console.log('Enrollment response:', response);
      
      if (response.data.success) {
        toast.success('Student enrolled successfully');
        navigate('/enrollments');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      console.error('Enrollment error response:', error.response?.data);
      
      if (error.response?.status === 404) {
        toast.error('Enrollment endpoint not found. Check if backend route "/api/enrollment/enroll" exists.');
      } else if (error.response?.data?.message?.includes("Only access to admin")) {
        toast.error('Faculty members should be able to enroll students in their own courses. Please check backend middleware - it should allow faculty access, not just admin.');
      } else if (error.response?.data?.message?.includes("not found")) {
        toast.error('Course not found or you do not have permission to enroll students in this course.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to enroll student');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/enrollments')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Enrollments
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enroll Student</h1>
          <p className="text-gray-600 mb-8">Add a student to a course</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Email *
              </label>
              <input
                type="email"
                required
                value={formData.studentEmail}
                onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="student@example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the student's email address
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. CS101"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the course code (e.g. CS101)
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/enrollments')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUserPlus className="mr-2" />
                    Enroll Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollStudent;
