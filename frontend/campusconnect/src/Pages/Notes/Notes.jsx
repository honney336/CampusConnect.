import React, { useState, useEffect } from 'react';
import { 
  FaStickyNote, 
  FaUser, 
  FaCalendarAlt, 
  FaFile,
  FaFileAlt,
  FaInfoCircle,
  FaDownload,
  FaTrash,
  FaUpload
} from 'react-icons/fa';
import { getAllNotes, downloadNote, deleteNote } from '../../API/API';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getAllNotes();
      
      if (response?.data?.success && response?.data?.notes) {
        setNotes(response.data.notes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(userData.role || '');
    fetchNotes();
  }, []);

  const handleDownload = async (note) => {
    try {
      const response = await downloadNote(note.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', note.fileName || `${note.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotes(prevNotes => 
        prevNotes.map(n => 
          n.id === note.id 
            ? { ...n, downloadCount: (n.downloadCount || 0) + 1 }
            : n
        )
      );
      
      toast.success('File downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download note');
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const response = await deleteNote(noteId);
      if (response.data.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        toast.success('Note deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading notes...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Course Notes</h1>
              <p className="text-gray-600 mt-1">Access and download course materials and notes</p>
            </div>
            
            {(userRole === 'faculty' || userRole === 'admin') && (
              <button
                onClick={() => navigate('/upload-note')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaUpload className="mr-2" />
                Upload Note
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {notes.length > 0 ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FaStickyNote className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Available Notes ({notes.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaStickyNote className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {note.title || 'Note Title'}
                          </h3>
                          <p className="text-lg text-gray-700 font-medium mb-2">
                            {note.course?.code || note.courseCode || 'General Notes'}
                          </p>
                          
                          {note.course?.title && (
                            <p className="text-sm text-gray-600 mb-2">
                              {note.course.title}
                            </p>
                          )}

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FaUser className="w-4 h-4 mr-2" />
                            <span className="font-medium">Uploaded by: </span>
                            <span className="ml-1">
                              {note.uploadedBy || note.user?.username || 'Unknown'}
                            </span>
                          </div>

                          {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && note.user && (
                            <div className="bg-blue-50 p-2 rounded-md mt-2">
                              <p className="text-sm text-blue-800 font-medium">
                                Uploader: {note.user.username}
                              </p>
                              <p className="text-xs text-blue-600">
                                {note.user.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-200 pt-4 flex-grow">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span>Uploaded:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(note.createdAt || note.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {note.fileSize && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaFile className="w-4 h-4 mr-2" />
                              <span>File Size:</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        )}

                        {note.fileType && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaFileAlt className="w-4 h-4 mr-2" />
                              <span>File Type:</span>
                            </div>
                            <span className="font-medium text-gray-900 uppercase">
                              {note.fileType.replace('.', '')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaDownload className="w-4 h-4 mr-2" />
                            <span>Downloads:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {note.downloadCount || 0}
                          </span>
                        </div>

                        {note.description && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-start">
                              <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                              <p className="text-sm text-gray-700">
                                {note.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                        <button
                          onClick={() => handleDownload(note)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <FaDownload className="w-4 h-4 mr-2" />
                          Download
                        </button>

                        {(JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' || 
                          note.uploadedBy === JSON.parse(localStorage.getItem('user') || '{}').username) && (
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaStickyNote className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notes available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Notes will appear here when uploaded by faculty or administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
