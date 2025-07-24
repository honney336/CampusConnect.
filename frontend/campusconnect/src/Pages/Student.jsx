// import React, { useState } from 'react';
// import axios from 'axios';
// import { changePassword  } from '../API/API';

// const Student = () => {
//   // Example profile data (replace with real data from your backend)
//   const [profile] = useState({
//     name: "Student Name",
//     email: "student@email.com",
//     role: "student"
//   });

//   // Change password state
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       // You may need to add authentication headers (e.g., JWT token)
//       const res = await changePassword({
//         oldPassword,
//         newPassword
//       }, {
//         withCredentials: true // if using cookies for auth
//       });
//       setMessage(res.data.message || "Password changed successfully!");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message || "Failed to change password"
//       );
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
//       <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Student Dashboard</h1>
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">Profile</h2>
//           <div className="bg-gray-100 rounded-md p-4">
//             <p><span className="font-semibold">Name:</span> {profile.name}</p>
//             <p><span className="font-semibold">Email:</span> {profile.email}</p>
//             <p><span className="font-semibold">Role:</span> {profile.role}</p>
//           </div>
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h2>
//           <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
//             <input
//               type="password"
//               placeholder="Current Password"
//               className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={oldPassword}
//               onChange={e => setOldPassword(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="New Password"
//               className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={newPassword}
//               onChange={e => setNewPassword(e.target.value)}
//               required
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold py-3 transition"
//               disabled={loading}
//             >
//               {loading ? "Changing..." : "Change Password"}
//             </button>
//           </form>
//           {message && (
//             <div className={`mt-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Student; 
import React, { useState, useEffect } from 'react';
import { changePassword } from '../API/API';

const Student = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfile(user);
        if (user.role !== "student") {
          window.location.href = "/";
        }
      } catch (err) {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
    setLoadingProfile(false);
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await changePassword(
        { oldpassword: oldPassword, newpassword: newPassword },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Password changed successfully!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to change password"
      );
    }
    setLoading(false);
  };

  if (loadingProfile) {
    return <div>Loading...</div>;
  }

  if (!profile || profile.role !== "student") {
    return <div className="text-center text-red-600 mt-10">Access denied.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl">
          <div className="bg-blue-600 rounded-t-2xl px-8 py-8 flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-700 font-bold">
              <span role="img" aria-label="avatar">👤</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
              <div className="text-lg text-blue-100 capitalize">{profile.role}</div>
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xl">👤</span>
                <div>
                  <div className="text-xs text-gray-500">Full Name</div>
                  <div className="font-semibold">{profile.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xl">📧</span>
                <div>
                  <div className="text-xs text-gray-500">Email Address</div>
                  <div className="font-semibold">{profile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xl">🎓</span>
                <div>
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="font-semibold capitalize">{profile.role}</div>
                </div>
              </div>
              {/* You can add "Member Since" if you have that info */}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6">Account Actions</h3>
          <form className="w-full flex flex-col gap-4" onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Current Password"
              className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold py-3 transition"
              disabled={loading}
            >
              {loading ? "Changing..." : (
                <span>
                  <span role="img" aria-label="lock" className="mr-2">🔒</span>
                  Change Password
                </span>
              )}
            </button>
          </form>
          {message && (
            <div className={`mt-4 text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;