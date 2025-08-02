import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaPlus, FaEdit, FaTrash, FaUser, FaInfoCircle } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading events...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600 mt-1">View and manage upcoming events and activities</p>
            </div>
            
            {(userRole === 'admin' || userRole === 'faculty') && (
              <button
                onClick={() => navigate('/create-event')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                <FaPlus className="mr-2" />
                Create Event
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
          {events.length > 0 ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Events ({events.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaCalendarAlt className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <div className="mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${EVENT_TYPE_COLORS[event.eventType]}`}>
                              {event.eventType}
                            </span>
                          </div>
                          
                          {event.createdBy && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FaUser className="w-4 h-4 mr-2" />
                              <span className="font-medium">Created by: </span>
                              <span className="ml-1">
                                {event.creator?.username || 'Unknown'}
                              </span>
                            </div>
                          )}

                          {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && event.creator && (
                            <div className="bg-blue-50 p-2 rounded-md mt-2">
                              <p className="text-sm text-blue-800 font-medium">
                                Creator: {event.creator.username}
                              </p>
                              <p className="text-xs text-blue-600">
                                {event.creator.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-200 pt-4 flex-grow">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span>Date:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaClock className="w-4 h-4 mr-2" />
                            <span>Time:</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(event.eventDate).toLocaleTimeString()}
                          </span>
                        </div>

                        {event.description && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-start">
                              <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                              <p className="text-sm text-gray-700">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {(userRole === 'admin' || (userRole === 'faculty' && String(event.createdBy) === String(user?.id))) && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                          <button
                            onClick={() => navigate(`/update-event/${event.id}`)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <FaEdit className="w-4 h-4 mr-2" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(event.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Events will appear here when created by faculty or administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
