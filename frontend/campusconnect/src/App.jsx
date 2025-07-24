import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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
import Events from './Pages/Events'
import Enrollments from './Pages/Enrollments'
import Notes from './Pages/Notes'
import CreateAnnouncement from './Pages/Announcement/CreateAnnouncement'
import AnnouncementDetail from './Pages/Announcement/AnnouncementDetails';

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
        <Route path='/notes' element={<Notes/>} />
        <Route path='/enrollments' element={<Enrollments/>} />
        <Route path='/createannouncement' element={<CreateAnnouncement userRole={userRole}/>} />
        <Route path="/announcement/:id" element={<AnnouncementDetail />} />

        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        {/* <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<Profile/>} /> */}
        <Route path='/admindashboard' element={<Admin/>} />
        <Route path='/studentdashboard' element={<Student/>} />
        <Route path='/facultydashboard' element={<Faculty/>} />

      </Routes>
    </Router>
    )
  }

  export default App