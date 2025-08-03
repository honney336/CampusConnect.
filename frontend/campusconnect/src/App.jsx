import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './Pages/Component/Navbar'
import { Toaster } from 'react-hot-toast'
import Homepage from './Pages/Homepage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Student from './Pages/Student'
import Faculty from './Pages/Faculty'
import Admin from './Pages/Admin'
import Announcements from './Pages/Announcement/Announcements'
import Courses from './Pages/Course/Courses'
import Events from './Pages/Events/Events'
import Enrollments from './Pages/Enrollment/Enrollments';
import Notes from './Pages/Notes/Notes';
import CreateAnnouncement from './Pages/Announcement/CreateAnnouncement'
import AnnouncementDetail from './Pages/Announcement/AnnouncementDetail';
import CreateEvent from './Pages/Events/CreateEvent';
import UpdateEvent from './Pages/Events/UpdateEvent';
import CreateCourse from './Pages/Course/CreateCourse';
import UpdateCourse from './Pages/Course/UpdateCourse';
import UploadNote from './Pages/Notes/UploadNote';
import EnrollStudent from './Pages/Enrollment/EnrollStudent';
import ActivityLogs from './Pages/Admin/ActivityLogs'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import UserManagement from './Pages/Admin/UserManagement'
import AdminProfile from './Pages/Admin/AdminProfile'
import StudentDashboard from './Pages/Student/StudentDashboard'
import UpdateAnnouncement from './Pages/Announcement/UpdateAnnouncement';
import StudentProfile from './Pages/Student/StudentProfile';
import FacultyDashboard from './Pages/Faculty/FacultyDashboard'
import FacultyProfile from './Pages/Faculty/FacultyProfile'

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  
  return Element;
};

function App() {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userRole = user.role || null;
  
  return (
    <Router>
      <Toaster/>
      <Navbar/>
      <div className="pt-0.5 px-0"></div>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/announcements' element={<Announcements/>} />
        <Route path='/events' element={<Events/>} />
        <Route path='/courses' element={<Courses/>} />
        <Route path="/notes" element={<Notes />} />
        <Route 
          path="/enrollments" 
          element={
            <ProtectedRoute 
              element={<Enrollments />} 
              allowedRoles={['admin', 'student', 'faculty']} 
            />
          } 
        />
        <Route path='/createannouncement' element={<CreateAnnouncement userRole={userRole}/>} />
        <Route path="/announcement/:id" element={<AnnouncementDetail />} />
        <Route path='/create-event' element={<CreateEvent/>} />
        <Route path='/update-event/:id' element={<UpdateEvent/>} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/update-course/:id" element={<UpdateCourse />} />
        <Route 
          path="/upload-note" 
          element={
            <ProtectedRoute 
              element={<UploadNote />} 
              allowedRoles={['admin', 'faculty']} 
            />
          } 
        />
        <Route path="/enroll-student" element={<EnrollStudent />} />

        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        {/* <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<Profile/>} /> */}
        <Route path='/admindashboard' element={
          <ProtectedRoute 
            element={<AdminDashboard />} 
            allowedRoles={['admin']} 
          />
        } />
        <Route path='/admin-dashboard' element={
          <ProtectedRoute 
            element={<AdminDashboard />} 
            allowedRoles={['admin']} 
          />
        } />
        <Route path='/studentdashboard' element={
          <ProtectedRoute 
            element={<StudentDashboard />} 
            allowedRoles={['student']} 
          />
        } />
        <Route path='/facultydashboard' element={
          <ProtectedRoute 
            element={<FacultyDashboard />} 
            allowedRoles={['faculty']} 
          />
        } />
        <Route path="/create-announcement" element={
          <ProtectedRoute 
            element={<CreateAnnouncement />} 
            allowedRoles={['admin', 'faculty']} 
          />
        } />
        <Route path="/activity-logs" element={
          <ProtectedRoute 
            element={<ActivityLogs />} 
            allowedRoles={['admin']} 
          />
        } />
        <Route path="/user-management" element={
          <ProtectedRoute 
            element={<UserManagement />} 
            allowedRoles={['admin']} 
          />
        } />
        <Route path="/admin-profile" element={
          <ProtectedRoute 
            element={<AdminProfile />} 
            allowedRoles={['admin']} 
          />
        } />
        <Route path="/student-profile" element={
          <ProtectedRoute 
            element={<StudentProfile />} 
            allowedRoles={['student']} 
          />
        } />
        <Route path="/update-announcement/:id" element={<UpdateAnnouncement />} />
        <Route path="/faculty-dashboard" element={
          <ProtectedRoute 
            element={<FacultyDashboard />} 
            allowedRoles={['faculty']} 
          />
        } />
        <Route path="/faculty-profile" element={
          <ProtectedRoute 
            element={<FacultyProfile />} 
            allowedRoles={['faculty']} 
          />
        } />
      </Routes>
    </Router>
  )
}

export default App