import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnnouncementById } from "../../API/API";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const response = await getAnnouncementById(id);
      if (response?.data?.success) {
        setAnnouncement(response.data.announcement);
      }
      setLoading(false);
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!announcement) return <div>Announcement not found.</div>;

  return (
    <div className="max-w-2xl mx-auto pt-16 px-4">
      <h1 className="text-2xl font-bold mb-4">{announcement.title}</h1>
      <div className="mb-6 text-gray-700 whitespace-pre-line">
        {announcement.content}
      </div>
      {/* Add more details as needed */}
    </div>
  );
};

export default AnnouncementDetails;