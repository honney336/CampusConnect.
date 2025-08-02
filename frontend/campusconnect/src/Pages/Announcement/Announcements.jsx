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
  FaArrowRight,
  FaInfoCircle,
  FaTrash
} from "react-icons/fa";
import { getAllAnnouncements, deleteAnnouncement } from "../../API/API";
import toast from 'react-hot-toast';

// Safe localStorage utility functions
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof Storage === "undefined" || typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  getUser: () => {
    try {
      const userData = safeLocalStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      if (!user || typeof user !== 'object') {
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
};

const PRIORITY_COLORS = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const ANNOUNCEMENT_TYPE_COLORS = {
  general: 'bg-gray-100 text-gray-800',
  academic: 'bg-blue-100 text-blue-800',
  exam: 'bg-red-100 text-red-800',
  assignment: 'bg-green-100 text-green-800',
  event: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-purple-100 text-purple-800'
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
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Initialize user data safely
  useEffect(() => {
    try {
      const token = safeLocalStorage.getItem('token');
      const userData = safeLocalStorage.getUser();
      
      if (!token) {
        console.log("No authentication token found, redirecting to login");
        navigate("/login");
        return;
      }

      if (userData) {
        setUser(userData);
        setUserRole(userData.role || '');
        console.log('User initialized successfully:', userData);
      } else {
        console.log("No valid user data found");
        setUser({});
        setUserRole('');
      }

    } catch (error) {
      console.error('Error initializing user:', error);
      setUser({});
      setUserRole('');
    }
  }, [navigate]);

  // Fetch announcements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = safeLocalStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(null);

        console.log("Fetching announcements with token:", token);
        
        const res = await getAllAnnouncements();
        console.log("API Response:", res);

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
          try {
            safeLocalStorage.getItem('token') && localStorage.removeItem("token");
            safeLocalStorage.getItem('user') && localStorage.removeItem("user");
          } catch (clearError) {
            console.error("Error clearing localStorage:", clearError);
          }
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

    // Only fetch if we have attempted to initialize user
    if (user !== null) {
      fetchData();
    }
  }, [navigate, retrying, user]);

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

  const handleDelete = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const response = await deleteAnnouncement(announcementId);
      if (response.data.success) {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementId));
        toast.success('Announcement deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const canModifyAnnouncement = (announcement) => {
    return userRole === 'admin' || (userRole === 'faculty' && announcement.createdBy === user?.id);
  };

  const getTypeColor = (type) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      academic: 'bg-blue-100 text-blue-800',
      exam: 'bg-red-100 text-red-800',
      assignment: 'bg-green-100 text-green-800',
      event: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || colors.general;
  };

  const getAnnouncementTypeColor = (type) => {
    const colors = {
      High: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
      Medium: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      Low: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
            <button
              onClick={() => setRetrying(true)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-600 mt-1">View and manage campus announcements</p>
            </div>
            
            {(userRole === "admin" || userRole === "faculty") && (
              <button
                onClick={() => navigate("/createannouncement")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaPlus className="mr-2" />
                New Announcement
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
            >
              <option value="All">All Courses</option>
              {courses.map((course, i) => (
                <option key={`course-${course}-${i}`} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filtered.length > 0 ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FaBullhorn className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Campus Announcements ({filtered.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((announcement) => (
                    <div key={`announcement-${announcement.id}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaBullhorn className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {announcement.title}
                          </h3>
                          
                          <div className="flex gap-2 mb-2">
                            {announcement.announcementType && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ANNOUNCEMENT_TYPE_COLORS[announcement.announcementType]}`}>
                                {announcement.announcementType.charAt(0).toUpperCase() + announcement.announcementType.slice(1)}
                              </span>
                            )}
                            
                            {announcement.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[announcement.priority]}`}>
                                {announcement.priority} Priority
                              </span>
                            )}
                          </div>

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FaUser className="w-4 h-4 mr-2" />
                            <span className="font-medium">Posted by: </span>
                            <span className="ml-1">
                              {announcement.creator?.username || "Unknown"}
                            </span>
                          </div>

                          {(() => {
                            try {
                              const currentUser = safeLocalStorage.getUser();
                              return currentUser?.role === 'admin' && announcement.creator && (
                                <div className="bg-blue-50 p-2 rounded-md mt-2">
                                  <p className="text-sm text-blue-800 font-medium">
                                    Creator: {announcement.creator.username}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    {announcement.creator.email}
                                  </p>
                                </div>
                              );
                            } catch (error) {
                              console.error('Error checking user role:', error);
                              return null;
                            }
                          })()}
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-200 pt-4 flex-grow">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span>Posted:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(announcement.created_At).toLocaleDateString()}
                          </span>
                        </div>

                        {announcement.course && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaBook className="w-4 h-4 mr-2" />
                              <span>Course:</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {announcement.course.code}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <div className="flex items-start">
                            <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {announcement.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                        <button
                          onClick={() => handleReadMore(announcement.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          <FaArrowRight className="w-3 h-3 mr-1" />
                          Read
                        </button>

                        {canModifyAnnouncement(announcement) && (
                          <>
                            <button
                              onClick={() => navigate(`/update-announcement/${announcement.id}`)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 transition-colors"
                            >
                              <FaEdit className="w-3 h-3 mr-1" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(announcement.id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              <FaTrash className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaBullhorn className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Announcements will appear here when posted by faculty or administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
