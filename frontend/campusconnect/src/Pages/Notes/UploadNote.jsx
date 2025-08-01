import React, { useState } from 'react';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import { uploadNote } from '../../API/API';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UploadNote = () => {
  const navigate = useNavigate();
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    courseId: '',
    file: null
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('courseId', uploadData.courseId);
      formData.append('file', uploadData.file);

      await uploadNote(formData);
      toast.success('Note uploaded successfully!');
      navigate('/notes');
    } catch (error) {
      console.error('Error uploading note:', error);
      toast.error('Failed to upload note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Notes
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload New Note</h1>
          <p className="text-gray-600 mb-8">Share course materials with students</p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter note title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Enter note description"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID (Optional)
              </label>
              <input
                type="text"
                value={uploadData.courseId}
                onChange={(e) => setUploadData({...uploadData, courseId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter course ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File *
              </label>
              <input
                type="file"
                onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/notes')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                <FaUpload className="mr-2" />
                Upload Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNote;
