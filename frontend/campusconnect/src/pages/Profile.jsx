import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserRole, getUsername, getUserId } from '../auth';
import { userService } from '../services/userService';
import { enrollmentService } from '../services/enrollmentService';
import { courseService } from '../services/courseService';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  BookOpen, 
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import Spinner from '../components/Spinner';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const userRole = getUserRole();
  const username = getUsername();
  const userId = getUserId();

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchUserCourses();
    }
  }, [activeTab]);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      if (userRole === 'student') {
        const response = await enrollmentService.getStudentEnrollments();
        setEnrollments(response.enrollments || []);
      } else if (userRole === 'faculty') {
        const response = await courseService.getFacultyCourses();
        setCourses(response.courses || []);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      toast.success('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and information</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex space-x-2">
              <TabButton
                id="profile"
                label="Profile Info"
                isActive={activeTab === 'profile'}
                onClick={setActiveTab}
              />
              <TabButton
                id="security"
                label="Security"
                isActive={activeTab === 'security'}
                onClick={setActiveTab}
              />
              <TabButton
                id="courses"
                label={userRole === 'student' ? 'My Enrollments' : 'My Courses'}
                isActive={activeTab === 'courses'}
                onClick={setActiveTab}
              />
            </div>
          </div>

          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
                    <p className="text-gray-600 capitalize">{userRole}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="font-medium">{username}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          userRole === 'admin' ? 'bg-red-100 text-red-800' :
                          userRole === 'faculty' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {userRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">January 2024</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {userRole === 'student' ? 'Enrolled Courses' : 
                           userRole === 'faculty' ? 'Teaching Courses' : 'Total Courses'}
                        </p>
                        <p className="font-medium">
                          {userRole === 'student' ? enrollments.length : courses.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          oldPassword: e.target.value
                        }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.old ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors duration-200"
                  >
                    {loading ? (
                      <Spinner size="small" />
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {userRole === 'student' ? 'My Enrollments' : 'My Courses'}
                </h3>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="medium" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRole === 'student' && enrollments.length > 0 && (
                      enrollments.map((enrollment, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{enrollment.title}</h4>
                              <p className="text-sm text-blue-600">{enrollment.code}</p>
                              <p className="text-sm text-gray-600 mt-1">{enrollment.description}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <p>Semester {enrollment.semester}</p>
                              <p>{enrollment.credit} Credits</p>
                              <p>Faculty: {enrollment.CreatedBy}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {userRole === 'faculty' && courses.length > 0 && (
                      courses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{course.title}</h4>
                              <p className="text-sm text-blue-600">{course.code}</p>
                              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <p>Semester {course.semester}</p>
                              <p>{course.credit} Credits</p>
                              <p>{course.enrollments?.length || 0} Students</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {((userRole === 'student' && enrollments.length === 0) || 
                      (userRole === 'faculty' && courses.length === 0)) && (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {userRole === 'student' 
                            ? 'You are not enrolled in any courses yet'
                            : 'You are not teaching any courses yet'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;