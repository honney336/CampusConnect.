import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './auth';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import CoursesList from './pages/CoursesList';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Notes from './pages/Notes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes - All authenticated users */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <CoursesList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/courses/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <CourseDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/announcements" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <Announcements />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/events" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <Events />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <Notes />
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
                  <p className="text-gray-600 mt-2">Student-specific features coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Faculty Routes */}
          <Route 
            path="/faculty/*" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h2>
                  <p className="text-gray-600 mt-2">Faculty-specific features coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                  <p className="text-gray-600 mt-2">Admin-specific features coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;