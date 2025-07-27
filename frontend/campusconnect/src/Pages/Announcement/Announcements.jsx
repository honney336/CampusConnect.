import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaBullhorn,
  FaSearch,
  FaPlus,
  FaEdit,
  FaArrowRight
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
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  // Fetch announcements
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add request debugging
        console.log("Fetching announcements with token:", token);
        
        const res = await getAllAnnouncements();
        console.log("API Response:", res); // Debug response

        // Validate response structure
        if (!res) {
          throw new Error("No response from server");
        }

        if (res.status === 500) {
          throw new Error("Internal server error. Please try again later.");
        }

        if (!res.data) {
          throw new Error("Invalid response format");
        }

        const { success, announcements: data, message } = res.data;

        if (!success) {
          throw new Error(message || "Failed to load announcements");
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid announcements data format");
        }

        setAnnouncements(data);
        setFiltered(data);

      } catch (err) {
        console.error("Detailed error:", {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(err.response?.data?.message || err.message || "Failed to fetch announcements");
        setAnnouncements([]);
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    fetchData();
  }, [navigate, retrying]);

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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <button
          onClick={() => setRetrying(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header with Create Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
              <p className="text-sm text-gray-500 mt-1">View and manage campus announcements</p>
            </div>
            {(userRole === "admin" || userRole === "faculty") && (
              <button
                onClick={() => navigate("/createannouncement")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base 
                         font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaPlus className="w-5 h-5 mr-2" />
                New Announcement
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
            >
              <option value="All">All Courses</option>
              {courses.map((course, i) => (
                <option key={`course-${i}`} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Announcement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {announcement.title}
                  </h3>
                  {announcement.priority && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[announcement.priority]}`}>
                      {announcement.priority}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {announcement.content}
                </p>

                {announcement.course && (
                  <div className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm">
                    <FaBook className="mr-1.5" />
                    {announcement.course.code}
                  </div>
                )}
              </div>

              {/* Card Footer - Updated for consistent sizing */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="truncate">{announcement.creator?.username || "Unknown"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span>{new Date(announcement.created_At).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => handleReadMore(announcement.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Read more <FaArrowRight className="ml-1.5 w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
