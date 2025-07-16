import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { eventService } from '../services/eventService';
import { getUserRole } from '../auth';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import Spinner from '../components/Spinner';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const userRole = getUserRole();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response.events || []);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.creator?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || event.eventType === filterType;
    const matchesPriority = filterPriority === '' || event.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTypeColor = (type) => {
    const colors = {
      exam: 'bg-red-100 text-red-800',
      assignment: 'bg-yellow-100 text-yellow-800',
      seminar: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      deadline: 'bg-orange-100 text-orange-800',
      holiday: 'bg-purple-100 text-purple-800',
      meeting: 'bg-gray-100 text-gray-800',
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || colors.other;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const isUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  const isPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const EventCard = ({ event }) => (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${
      isPast(event.eventDate) ? 'opacity-75' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(event.eventType)}`}>
              {event.eventType}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(event.priority)}`}>
              {event.priority}
            </span>
            {isPast(event.eventDate) && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                Past
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{event.creator}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(event.eventDate).toLocaleString()}</span>
            </div>
            {event.course && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{event.course}</span>
              </div>
            )}
          </div>
        </div>
        
        {event.priority === 'urgent' && (
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        )}
      </div>
      
      {event.description && (
        <div className="text-gray-700 leading-relaxed">
          <p>{event.description}</p>
        </div>
      )}
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
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="mt-2 text-gray-600">
              Stay informed about upcoming events and important dates
            </p>
          </div>
          
          {(userRole === 'faculty' || userRole === 'admin') && (
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
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
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
                <option value="deadline">Deadline</option>
                <option value="holiday">Holiday</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {/* Upcoming Events */}
            {filteredEvents.filter(event => isUpcoming(event.eventDate)).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {filteredEvents
                    .filter(event => isUpcoming(event.eventDate))
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                    .map((event, index) => (
                      <EventCard key={`upcoming-${index}`} event={event} />
                    ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {filteredEvents.filter(event => isPast(event.eventDate)).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
                <div className="space-y-4">
                  {filteredEvents
                    .filter(event => isPast(event.eventDate))
                    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
                    .map((event, index) => (
                      <EventCard key={`past-${index}`} event={event} />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType || filterPriority
                ? 'Try adjusting your search criteria'
                : 'No events are scheduled at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;