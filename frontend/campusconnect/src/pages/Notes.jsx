import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { notesService } from '../services/notesService';
import { getUserRole } from '../auth';
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Filter,
  User,
  BookOpen,
  Calendar,
  File
} from 'lucide-react';
import Spinner from '../components/Spinner';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const userRole = getUserRole();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesService.getAllNotes();
      setNotes(response.notes || []);
    } catch (error) {
      toast.error('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId, fileName) => {
    try {
      const response = await notesService.downloadNotes(noteId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Error downloading file:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || note.fileType === filterType;
    
    return matchesSearch && matchesType;
  });

  const getFileIcon = (fileType) => {
    const iconMap = {
      '.pdf': '📄',
      '.doc': '📝',
      '.docx': '📝',
      '.ppt': '📊',
      '.pptx': '📊',
      '.txt': '📄',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.png': '🖼️'
    };
    return iconMap[fileType] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUniqueFileTypes = () => {
    const types = [...new Set(notes.map(note => note.fileType))];
    return types.sort();
  };

  const NotesCard = ({ note }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{getFileIcon(note.fileType)}</span>
            <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {note.fileType.toUpperCase().replace('.', '')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{note.uploadedBy}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{note.course} ({note.courseCode})</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(note.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
            <div className="flex items-center">
              <File className="h-4 w-4 mr-1" />
              <span>{note.fileName}</span>
            </div>
            <span>•</span>
            <span>{formatFileSize(note.fileSize)}</span>
            <span>•</span>
            <span>{note.downloadCount} downloads</span>
          </div>
        </div>
      </div>
      
      {note.description && (
        <div className="text-gray-700 mb-4">
          <p>{note.description}</p>
        </div>
      )}

      {note.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.split(',').map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Uploaded {new Date(note.uploadedAt).toLocaleDateString()}
        </div>
        <button
          onClick={() => handleDownload(note.id, note.fileName)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
            <p className="mt-2 text-gray-600">
              Access course materials and study resources
            </p>
          </div>
          
          {(userRole === 'faculty' || userRole === 'admin') && (
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Upload Notes
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes, courses, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All File Types</option>
                {getUniqueFileTypes().map(type => (
                  <option key={type} value={type}>
                    {type.toUpperCase().replace('.', '')} Files
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNotes.map((note) => (
              <NotesCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType 
                ? 'Try adjusting your search criteria'
                : 'No study notes are available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;