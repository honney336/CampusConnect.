// import React, { useEffect, useState } from "react";
// import { getAllAnnouncements } from "../API/API";
// import { FaUser, FaBook, FaCalendarAlt, FaBullhorn } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Announcements = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchAnnouncements = async () => {
//       try {
//         const response = await getAllAnnouncements();
//         if (response?.data?.success && Array.isArray(response.data.announcements)) {
//           setAnnouncements(response.data.announcements);
//         } else {
//           setError("Failed to load announcements");
//         }
//       } catch (err) {
//         console.error("Error fetching announcements:", err);
//         setError("Error fetching announcements");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg text-gray-600">Loading announcements...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 mb-4">
//           <FaBullhorn className="h-8 w-8 text-blue-600" />
//         </div>
//         <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//           Announcements
//         </h1>
//         <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
//           Latest updates from your courses
//         </p>
//       </div>

//       {/* 3-Column Grid */}
//       {announcements.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No announcements found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {announcements.map((announcement) => (
//             <div
//               key={announcement.id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
//             >
//               <div className="p-6">
//                 <div className="flex items-center mb-2">
//                   <FaBook className="text-blue-500 mr-2" />
//                   <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
//                     {announcement.title}
//                   </h2>
//                 </div>
//                 <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-4">
//                   {announcement.content}
//                 </p>

//                 <div className="flex items-center text-sm text-gray-500 mb-2">
//                   <FaUser className="mr-2" />
//                   <span>
//                     {announcement.creator?.username || "Unknown"} (
//                     {announcement.creator?.role || "N/A"})
//                   </span>
//                 </div>
//                 {announcement.course && (
//                   <div className="flex items-center text-sm text-gray-500 mb-3">
//                     <FaBook className="mr-2" />
//                     <span>
//                       {announcement.course.title} ({announcement.course.code})
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex items-center text-xs text-gray-400">
//                   <FaCalendarAlt className="mr-2" />
//                   <span>
//                     Posted: {new Date(announcement.created_At).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//               <div className="px-6 py-3 bg-gray-50 text-right">
//                 <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Announcements;



// import React, { useEffect, useState } from "react";
// import { getAllAnnouncements } from "../API/API";
// import { FaUser, FaBook, FaCalendarAlt, FaBullhorn, FaSearch, FaPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const PRIORITY_COLORS = {
//   High: "bg-red-100 text-red-700 border-red-400",
//   Medium: "bg-yellow-100 text-yellow-700 border-yellow-400",
//   Low: "bg-green-100 text-green-700 border-green-400",
// };

// const Announcements = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [courseFilter, setCourseFilter] = useState("All");
//   const [priorityFilter, setPriorityFilter] = useState("All");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchAnnouncements = async () => {
//       try {
//         const response = await getAllAnnouncements();
//         if (response?.data?.success && Array.isArray(response.data.announcements)) {
//           setAnnouncements(response.data.announcements);
//         } else {
//           setError("Failed to load announcements");
//         }
//       } catch (err) {
//         setError("Error fetching announcements");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, [navigate]);

//   // Extract unique courses for filter dropdown
//   const courses = [
//     ...new Set(
//       announcements
//         .filter(a => a.course)
//         .map(a => `${a.course.code} - ${a.course.title}`)
//     ),
//   ];

//   // Extract unique priorities for filter dropdown
//   const priorities = [
//     ...new Set(announcements.map(a => a.priority || "N/A")),
//   ].filter(p => p !== "N/A");

//   // Filtering logic
//   useEffect(() => {
//     let data = announcements;
//     if (search.trim()) {
//       data = data.filter(a =>
//         a.title.toLowerCase().includes(search.toLowerCase()) ||
//         a.content.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     if (courseFilter !== "All") {
//       data = data.filter(
//         a => a.course && `${a.course.code} - ${a.course.title}` === courseFilter
//       );
//     }
//     if (priorityFilter !== "All") {
//       data = data.filter(a => a.priority === priorityFilter);
//     }
//     setFiltered(data);
//   }, [search, courseFilter, priorityFilter, announcements]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg text-gray-600">Loading announcements...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">Announcements</h1>
//           <p className="mt-1 text-gray-500">Stay informed with the latest campus and course announcements</p>
//         </div>
//         <button
//           onClick={() => navigate("/createannouncement")}
//           className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition"
//         >
//           <FaPlus className="mr-2" /> Create Announcement
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8">
//         <div className="relative flex-1">
//           <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search announcements..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//         <select
//           className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           value={courseFilter}
//           onChange={e => setCourseFilter(e.target.value)}
//         >
//           <option value="All">All Courses</option>
//           {courses.map(course => (
//             <option key={course} value={course}>{course}</option>
//           ))}
//         </select>
//         <select
//           className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           value={priorityFilter}
//           onChange={e => setPriorityFilter(e.target.value)}
//         >
//           <option value="All">All Priorities</option>
//           {priorities.map(priority => (
//             <option key={priority} value={priority}>{priority} Priority</option>
//           ))}
//         </select>
//       </div>

//       {/* Announcements List */}
//       {filtered.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No announcements found.</p>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {filtered.map((announcement) => (
//             <div
//               key={announcement.id}
//               className={`bg-white rounded-xl shadow-md border-l-4 ${
//                 announcement.priority === "High"
//                   ? "border-red-400"
//                   : announcement.priority === "Medium"
//                   ? "border-yellow-400"
//                   : "border-gray-200"
//               } p-6 flex flex-col md:flex-row md:items-center`}
//             >
//               <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mr-4 mb-4 md:mb-0">
//                 <FaBullhorn className="text-blue-600 text-2xl" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
//                   {announcement.priority && (
//                     <span
//                       className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${
//                         PRIORITY_COLORS[announcement.priority] || "bg-gray-100 text-gray-700 border-gray-300"
//                       }`}
//                     >
//                       {announcement.priority} Priority
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-gray-700 mb-2">{announcement.content}</p>
//                 {announcement.course && (
//                   <div className="text-sm text-gray-600 mb-1">
//                     <span className="font-bold">{announcement.course.code}</span> &middot; {announcement.course.title}
//                   </div>
//                 )}
//                 <div className="flex items-center text-sm text-gray-500 gap-4">
//                   <span className="flex items-center">
//                     <FaUser className="mr-1" />
//                     {announcement.creator?.username || "Unknown"}
//                   </span>
//                   <span className="flex items-center">
//                     <FaCalendarAlt className="mr-1" />
//                     {new Date(announcement.created_At).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//               {/* Optional Edit button for admins */}
//               {/* <button className="ml-4 mt-4 md:mt-0 px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200">
//                 Edit
//               </button> */}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Announcements;


import React, { useEffect, useState } from "react";
import { getAllAnnouncements } from "../API/API";
import { FaUser, FaBook, FaCalendarAlt, FaBullhorn, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Example: get user role from localStorage or context
const userRole = localStorage.getItem("role"); // "admin", "faculty", "student", etc.

const PRIORITY_COLORS = {
  High: "bg-red-100 text-red-700 border-red-400",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-400",
  Low: "bg-green-100 text-green-700 border-green-400",
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await getAllAnnouncements();
        if (response?.data?.success && Array.isArray(response.data.announcements)) {
          setAnnouncements(response.data.announcements);
        } else {
          setError("Failed to load announcements");
        }
      } catch (err) {
        setError("Error fetching announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [navigate]);

  // Extract unique courses for filter dropdown
  const courses = [
    ...new Set(
      announcements
        .filter(a => a.course)
        .map(a => `${a.course.code} - ${a.course.title}`)
    ),
  ];

  // Extract unique priorities for filter dropdown
  const priorities = [
    ...new Set(announcements.map(a => a.priority || "N/A")),
  ].filter(p => p !== "N/A");

  // Filtering logic
  useEffect(() => {
    let data = announcements;
    if (search.trim()) {
      data = data.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (courseFilter !== "All") {
      data = data.filter(
        a => a.course && `${a.course.code} - ${a.course.title}` === courseFilter
      );
    }
    if (priorityFilter !== "All") {
      data = data.filter(a => a.priority === priorityFilter);
    }
    setFiltered(data);
  }, [search, courseFilter, priorityFilter, announcements]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Announcements</h1>
          <p className="mt-1 text-gray-500">Stay informed with the latest campus and course announcements</p>
        </div>
        {(userRole === "admin" || userRole === "faculty") && (
          <button
            onClick={() => navigate("/createannouncement")}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition"
          >
            <FaPlus className="mr-2" /> Create Announcement
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="All">All Courses</option>
          {courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority} Priority</option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No announcements found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl shadow-md border-l-4 ${
                announcement.priority === "High"
                  ? "border-red-400"
                  : announcement.priority === "Medium"
                  ? "border-yellow-400"
                  : "border-gray-200"
              } p-6 flex flex-col md:flex-row md:items-center`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mr-4 mb-4 md:mb-0">
                <FaBullhorn className="text-blue-600 text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
                  {announcement.priority && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        PRIORITY_COLORS[announcement.priority] || "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {announcement.priority} Priority
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{announcement.content}</p>
                {announcement.course && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-bold">{announcement.course.code}</span> &middot; {announcement.course.title}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span className="flex items-center">
                    <FaUser className="mr-1" />
                    {announcement.creator?.username || "Unknown"}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(announcement.created_At).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {/* Edit button only for admin or faculty */}
              {(userRole === "admin" || userRole === "faculty") && (
                <button className="ml-4 mt-4 md:mt-0 px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200">
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;