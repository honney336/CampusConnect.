import React, { useState } from "react";
import { createAnnouncement } from "../../API/API";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcementType: "general",
    courseCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const announcementTypes = [
    "general",
    "academic",
    "exam",
    "assignment",
    "event",
    "urgent",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await createAnnouncement({
        title: formData.title,
        content: formData.content,
        announcementType: formData.announcementType,
        courseCode: formData.courseCode || null, // Backend will handle course code conversion
      });

      if (response.data.success) {
        toast.success("Announcement created successfully");
        setFormData({
          title: "",
          content: "",
          announcementType: "general",
          courseCode: "",
        });

        navigate("/announcements");
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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/announcements")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Announcements
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Create Announcement</h2>

          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                required
                rows="6"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Type
              </label>
              <select
                value={formData.announcementType}
                onChange={(e) =>
                  setFormData({ ...formData, announcementType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {announcementTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData({ ...formData, courseCode: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. CS101"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave blank for general announcements
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/announcements")}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Create Announcement"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
