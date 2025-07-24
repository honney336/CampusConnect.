import React, { useState } from "react";
import { createAnnouncement } from "../../API/API";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

const CreateAnnouncement = ({ userRole, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcementType, setAnnouncementType] = useState("general");
  const [courseId, setCourseId] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
        priority,
      };

      const response = await createAnnouncement(payload);

      if (response.data.success) {
        alert("Announcement created successfully!");
        setTitle("");
        setContent("");
        setAnnouncementType("general");
        setCourseId("");
        setPriority("LOW");
        
        if (onSuccess) onSuccess(); // callback to refresh list or redirect
        navigate('/announcements')
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
  <option value="academic">Academic</option>
  <option value="exam">Exam</option>
  <option value="assignment">Assignment</option>
  <option value="event">Event</option>
  <option value="urgent">Urgent</option>
</select>

        <label className="block mb-2 font-medium">Course ID (optional)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter course ID if applicable"
          disabled={loading}
        />

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Priority Level
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
              required
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaExclamationCircle className={`h-5 w-5 ${
                priority === "HIGH" ? "text-red-500" :
                priority === "MEDIUM" ? "text-yellow-500" :
                "text-green-500"
              }`} />
            </div>
          </div>
        </div>

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
