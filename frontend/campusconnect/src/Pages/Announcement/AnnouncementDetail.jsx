import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnouncementById } from '../../API/API';
import { FaUser, FaBook, FaCalendarAlt, FaBullhorn, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const data = await getAnnouncementById(id);
      setAnnouncement(data);
    };

    fetchAnnouncement();
  }, [id]);

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading announcement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/announcements')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Announcements
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaBullhorn className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                Announcement Details
              </h1>
            </div>
          </div>

          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-6">
              {/* Announcement Header */}
              <div className="flex items-start mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaBullhorn className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {announcement.title}
                  </h2>
                  
                  {announcement.priority && (
                    <div className="mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[announcement.priority]}`}>
                        {announcement.priority} Priority
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaUser className="w-4 h-4 mr-2" />
                    <span className="font-medium">Posted by: </span>
                    <span className="ml-1">
                      {announcement.creator?.username || 'Unknown'}
                    </span>
                  </div>

                  {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && announcement.creator && (
                    <div className="bg-blue-50 p-2 rounded-md mt-2">
                      <p className="text-sm text-blue-800 font-medium">
                        Creator: {announcement.creator.username}
                      </p>
                      <p className="text-xs text-blue-600">
                        {announcement.creator.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Announcement Details */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span>Posted:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {new Date(announcement.created_At).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {announcement.course && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaBook className="w-4 h-4 mr-2" />
                      <span>Course:</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {announcement.course.code} - {announcement.course.title}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <h3 className="font-medium mb-2">Content:</h3>
                      <p className="leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
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
