// import React from 'react'
// import { Link } from 'react-router';

// const Navbar = () => {
// //   return (
// //     <div className='flex items-center justify-between p-2  bg-gray-200 text-white'>
// //         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/"}>Homepage</Link>
// //         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/login"}>Login</Link>
// //         <Link className="bg-blue-500 rounded-4xl pr-4 pl-4 p-2 m-2 text-white" to={"/register"}>Register</Link>
// //     </div>
// //   )
// // }
//  return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex justify-between items-center p-4 md:px-8 md:py-4">
//       <Link className="hover:text-blue-500 px-4 py-2 text-gray-800" to="/">
//         Homepage
//       </Link>
//       <Link className="hover:bg-blue-700 rounded-2xl px-4 py-2 text-white" to="/login">
//         Login
//       </Link>
//       <Link className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white" to="/register">
//         Register
//         </Link>
//       <Link className='bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white' to="/addproduct">
//         Add Product
//       </Link>
     
//     </div>
//   );
// };

// export default Navbar;import React, { useState } from "react";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHome, FaBullhorn, FaCalendarAlt, FaBook, FaStickyNote,
  FaUserGraduate, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaTimes,
  FaUser, FaCog
} from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setOpen(false);
  };

  // Get user data with debugging
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  let user = null;
  
  if (userData) {
    try {
      user = JSON.parse(userData);
      console.log("Parsed user:", user);
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }

  // If no user in localStorage but token exists, try to decode token
  if (!user && token) {
    try {
      const decode = jwtDecode(token);
      user = {
        id: decode.id,
        username: decode.username,
        name: decode.username,
        email: decode.email,
        role: decode.role
      };
      console.log("User from token:", user);
      // Store the decoded user data
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const role = user?.role;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6" style={{ height: '60px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo container */}
        <div className="flex-shrink-0 pl-4">
          <button 
            onClick={() => {
              if (role === 'admin') {
                navigate('/admindashboard');
              } else if (role === 'student') {
                navigate('/studentdashboard');
              } else if (role === 'faculty') {
                navigate('/facultydashboard');
              } else {
                navigate('/');
              }
            }}
            className="cursor-pointer"
          >
            <img
              src="/Campus.png"
              alt="CampusConnect LOGO"
              style={{ width: '80px' }}
              className="block hover:opacity-80 transition-opacity"
            />
          </button>
        </div>

        {/* Nav links centered or right-aligned */}
        <div className="hidden md:flex items-center flex-1">
          {!token ? (
            <>
              <div className="flex-1"></div>
              <Link to="/login" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 ml-auto">
                <FaSignInAlt /> Login
              </Link>
            </>
          ) : (
            <div className="flex items-center justify-between flex-1">
              {/* Navigation Links */}
              <div className="flex space-x-8 ml-8">
                <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaHome /> Home</Link>
                <Link to="/announcements" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaBullhorn /> Announcements</Link>
                <Link to="/events" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaCalendarAlt /> Events</Link>
                <Link to="/courses" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaBook /> Courses</Link>
                <Link to="/notes" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaStickyNote /> Notes</Link>
                <Link to="/enrollments" className="flex items-center gap-2 text-gray-800 hover:text-blue-600"><FaUserGraduate /> Enrollments</Link>
              </div>
              
              {/* User Info and Actions */}
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {user ? (user.username || user.name || 'Unknown User') : 'No User'}
                  </span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                    {user ? user.role : 'No Role'}
                  </span>
                </div>
                
                {/* Profile Button (only for admin) */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin-profile')}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Admin Profile"
                  >
                    <FaCog className="w-5 h-5" />
                  </button>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-2xl text-gray-800"
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setOpen(false)} className="text-2xl text-gray-800">
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          {!token ? (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              <FaSignInAlt /> Login
            </Link>
          ) : (
            <>
              {/* User Info in Mobile */}
              {user && (
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-600" />
                    <span className="text-gray-700 font-medium">{user.username || user.name || 'Unknown User'}</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                    {user.role}
                  </span>
                </div>
              )}
              
              <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaHome /> Home</Link>
              <Link to="/announcements" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaBullhorn /> Announcements</Link>
              <Link to="/events" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaCalendarAlt /> Events</Link>
              <Link to="/courses" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaBook /> Courses</Link>
              <Link to="/notes" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaStickyNote /> Notes</Link>
              <Link to="/enrollments" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaUserGraduate /> Enrollments</Link>
              
              {/* Admin Profile in Mobile */}
              {user?.role === 'admin' && (
                <Link to="/admin-profile" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}>
                  <FaCog /> Admin Profile
                </Link>
              )}
              
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-800 hover:text-red-600">
                <FaSignOutAlt /> Logout
              </button>
              {role === "admin" && (
                <Link to="/register" className="flex items-center gap-2 text-gray-800 hover:text-blue-600" onClick={() => setOpen(false)}><FaUserPlus /> Register</Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;