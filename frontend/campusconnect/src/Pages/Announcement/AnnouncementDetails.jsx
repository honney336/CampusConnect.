import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnnouncementById } from '../../API/API'; // Make sure this path is correct

const AnnouncementDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL
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
    return <div className="text-center py-10 text-gray-500">Loading announcement...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>
      <p className="text-gray-600 mb-6">{new Date(announcement.created_At).toLocaleDateString()}</p>
      <div className="text-gray-800 mb-4 whitespace-pre-wrap">{announcement.content}</div>
      {announcement.course && (
        <div className="text-sm text-gray-600">
          Course: <strong>{announcement.course.code}</strong> - {announcement.course.title}
        </div>
      )}
      {announcement.creator && (
        <div className="text-sm text-gray-600 mt-2">
          Posted by: <strong>{announcement.creator.username}</strong> ({announcement.creator.email})
        </div>
      )}
    </div>
  );
};

export default AnnouncementDetail;
