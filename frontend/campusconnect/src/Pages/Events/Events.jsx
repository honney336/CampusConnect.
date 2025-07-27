import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllEvents, deleteEvent } from '../../API/API';
import toast from 'react-hot-toast';

const EVENT_TYPE_COLORS = {
  exam: 'bg-red-100 text-red-800',
  assignment: 'bg-blue-100 text-blue-800',
  seminar: 'bg-green-100 text-green-800',
  workshop: 'bg-purple-100 text-purple-800',
  deadline: 'bg-yellow-100 text-yellow-800',
  holiday: 'bg-teal-100 text-teal-800',
  meeting: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800'
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setUserRole(userData?.role || '');
  }, []);

  const handleDelete = async (eventId) => {
    if (!eventId) {
      toast.error('Invalid event ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      console.log('Deleting event with ID:', eventId);
      const response = await deleteEvent(eventId);
      console.log('Delete response:', response);
      
      if (response?.data?.success) {
        toast.success('Event deleted successfully');
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } else {
        throw new Error(response?.data?.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Delete error:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const canModifyEvent = (event) => {
    return userRole === 'admin' || (userRole === 'faculty' && event.createdBy === user?.id);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllEvents();
        console.log('Events response:', response); // Debug log
        
        if (response?.data?.success) {
          setEvents(response.data.events);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Error loading events');
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          {(userRole === 'admin' || userRole === 'faculty') && (
            <button
              onClick={() => navigate('/create-event')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Create Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate pr-2">{event.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${EVENT_TYPE_COLORS[event.eventType]}`}>
                    {event.eventType}
                  </span>
                  {(userRole === 'admin' || (userRole === 'faculty' && String(event.createdBy) === String(user?.id))) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          console.log('Editing event:', event);
                          navigate(`/update-event/${event.id}`);
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                        title="Edit event"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Deleting event:', event);
                          handleDelete(event.id);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                        title="Delete event"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  {new Date(event.eventDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2 text-gray-400" />
                  {new Date(event.eventDate).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
