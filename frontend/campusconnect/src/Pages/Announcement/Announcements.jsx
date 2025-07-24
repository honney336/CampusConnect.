import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaBullhorn,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { getAllAnnouncements } from "../../API/API";

// Safely extract role from localStorage
let userRole = "";
try {
  const user = JSON.parse(localStorage.getItem("user"));
  userRole = user?.role || "";
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
}

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

  // Fetch announcements
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getAllAnnouncements();
        const data = res?.data?.announcements;
        if (res?.data?.success && Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          setError("Failed to load announcements");
        }
      } catch (err) {
        setError("Error fetching announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Unique course filter options
  const courses = useMemo(() => {
    return [...new Set(
      announcements
        .filter(a => a.course)
        .map(a => `${a.course.code} - ${a.course.title}`)
    )];
  }, [announcements]);

  // Unique priority filter options
  const priorities = useMemo(() => {
    return [...new Set(announcements.map(a => a.priority))].filter(Boolean);
  }, [announcements]);

  // Apply search and filters
  useEffect(() => {
    let data = [...announcements];

    if (search.trim()) {
      data = data.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (courseFilter !== "All") {
      data = data.filter(a =>
        a.course && `${a.course.code} - ${a.course.title}` === courseFilter
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(a => a.priority === priorityFilter);
    }

    setFiltered(data);
  }, [search, courseFilter, priorityFilter, announcements]);

  const handleReadMore = (announcementId) => {
    console.log("Attempting to read announcement with ID:", announcementId);
    if (!announcementId || isNaN(announcementId)) {
      console.error("Invalid announcement ID:", announcementId);
      return;
    }
    navigate(`/announcement/${announcementId}`);
  };

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
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="All">All Courses</option>
          {courses.map((course, i) => (
            <option key={`course-${i}`} value={course}>
              {course}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          {priorities.map((priority, i) => (
            <option key={`priority-${i}`} value={priority}>
              {priority} Priority
            </option>
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
              key={announcement.id}  // Sequelize uses 'id' not '_id'
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
                <p className="text-gray-700 mb-2 line-clamp-2">{announcement.content}</p>
                {announcement.course && (
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{announcement.course.code}</strong> &middot; {announcement.course.title}
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

              <div className="flex flex-col md:flex-row gap-2 items-center mt-4 md:mt-0">
                <button
                  onClick={() => {
                    console.log("Clicking announcement:", announcement); // Debug log
                    handleReadMore(announcement.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Read More
                </button>
                {(userRole === "admin" || userRole === "faculty") && (
                  <button className="ml-4 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
