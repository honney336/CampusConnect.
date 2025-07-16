import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { announcementService } from '../services/announcementService';
import { getUserRole } from '../auth';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import Spinner from '../components/Spinner';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const userRole = getUserRole();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementService.getAllAnnouncements();
      setAnnouncements(response.announcements || []);
    } catch (error) {
      toast.error('Failed to fetch announcements');
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.creator?.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || announcement.announcementType === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      exam: 'bg-red-100 text-red-800',
      assignment: 'bg-yellow-100 text-yellow-800',
      event: 'bg-purple-100 text-purple-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[type] || colors.general;
  };

  const AnnouncementCard = ({ announcement }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(announcement.announcementType)}`}>
              {announcement.announcementType}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{announcement.creator?.username}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(announcement.created_At).toLocaleDateString()}</span>
            </div>
            {announcement.course && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{announcement.course.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-gray-700 leading-relaxed">
        <p>{announcement.content}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="mt-2 text-gray-600">
              Stay updated with the latest news and information
            </p>
          </div>
          
          {(userRole === 'faculty' || userRole === 'admin') && (
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
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
                placeholder="Search announcements..."
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
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType 
                ? 'Try adjusting your search criteria'
                : 'No announcements are available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;