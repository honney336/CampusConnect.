import React from 'react'
import { Link } from 'react-router-dom';
import { createAnnouncement } from '../API/API';

const Admin = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Admin Dashboard</h1>
        <p className="mb-8 text-gray-600 text-center">
          Welcome, Admin! Use the options below to manage announcements and users.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/createannouncement">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition">
              Create Announcement
            </button>
          </Link>
          {/* <Link to="/manageusers">
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition">
              Manage Users
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default Admin;