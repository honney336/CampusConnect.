import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnouncementById } from '../../API/API';
import { FaUser, FaBook, FaCalendarAlt, FaBullhorn, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

const PRIORITY_COLORS = {
  High: "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
  Low: "bg-green-50 text-green-600 border-green-200",
};

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await getAnnouncementById(id);
        if (response?.data?.success) {
          setAnnouncement(response.data.announcement);
        } else {
          setError('Announcement not found');
        }
      } catch (err) {
        console.error('Error fetching announcement:', err);
        setError('Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/announcements')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <FaArrowLeft className="mr-2" />
            Back to Announcements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/announcements')}
          className="group mb-8 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Announcements</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FaBullhorn className="text-white text-xl" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {announcement?.title || 'Untitled Announcement'}
                </h2>
                {announcement?.priority && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${PRIORITY_COLORS[announcement.priority]}`}>
                    {announcement.priority} Priority
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 py-8 bg-white">
            <div className="prose max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                {announcement?.content || 'No content available'}
              </p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="bg-blue-50/50 border-t border-blue-100">
            <div className="px-6 py-4">
              {announcement?.course && (
                <div className="mb-4">
                  <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                    <FaBook className="text-blue-500 mr-2" />
                    <span className="font-medium text-blue-800">{announcement.course.code}</span>
                    <span className="mx-2 text-blue-200">•</span>
                    <span className="text-blue-600">{announcement.course.title}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-600 bg-white px-3 py-1.5 rounded-lg">
                  <FaUser className="mr-2 text-blue-500" />
                  <span>By <span className="font-medium text-blue-800">{announcement?.creator?.username || 'Unknown'}</span></span>
                </div>
                <div className="flex items-center text-gray-600 bg-white px-3 py-1.5 rounded-lg">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <time>
                    {announcement?.created_At ? 
                      new Date(announcement.created_At).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      'Date not available'
                    }
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;  
