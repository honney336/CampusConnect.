import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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
      const response = await enrollStudent({
        studentEmail: formData.studentEmail.toLowerCase(),
        courseCode: formData.courseCode.toUpperCase()
      });
      
      if (response.data.success) {
        toast.success('Student enrolled successfully');
        navigate('/enrollments');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/enrollments')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Enrollments
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Enroll Student</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Email
              </label>
              <input
                type="email"
                required
                value={formData.studentEmail}
                onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="student@example.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the student's email address
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. CS101"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the course code (e.g. CS101)
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/enrollments')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Enroll Student'
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
