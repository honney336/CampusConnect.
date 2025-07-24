import React, { useState } from "react";
import { createAnnouncement } from "../API/API";

const CreateAnnouncement = ({ userRole, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcementType, setAnnouncementType] = useState("general");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Only admin and faculty can see this form
  // if (userRole !== "admin" && userRole !== "faculty") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        content,
        announcementType,
        courseId: courseId || null,
      };

      const response = await createAnnouncement(payload);

      if (response.data.success) {
        alert("Announcement created successfully!");
        setTitle("");
        setContent("");
        setAnnouncementType("general");
        setCourseId("");
        if (onSuccess) onSuccess(); // callback to refresh list or redirect
      } else {
        setError(response.data.message || "Failed to create announcement.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" pt-16 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
          disabled={loading}
          required
        />

        <label className="block mb-2 font-medium">Content</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter announcement content"
          disabled={loading}
          required
        />

        <label className="block mb-2 font-medium">Type</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={announcementType}
          onChange={(e) => setAnnouncementType(e.target.value)}
          disabled={loading}
        >
          <option value="general">General</option>
          <option value="course">Course</option>
          <option value="event">Event</option>
        </select>

        <label className="block mb-2 font-medium">Course ID (optional)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter course ID if applicable"
          disabled={loading}
        />

        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Announcement"}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
