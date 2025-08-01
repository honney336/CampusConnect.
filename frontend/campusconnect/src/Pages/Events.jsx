import React from 'react'

const Events = () => {
  const events = [
    // Sample event data
    {
      id: 1,
      title: 'Event One',
      description: 'Description for event one.',
      date: '2023-10-10',
    },
    {
      id: 2,
      title: 'Event Two',
      description: 'Description for event two.',
      date: '2023-10-12',
    },
    {
      id: 3,
      title: 'Event Three',
      description: 'Description for event three.',
      date: '2023-10-14',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={`event-${event.id}-${event.title?.replace(/\s+/g, '-')}`} 
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {event.description}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;