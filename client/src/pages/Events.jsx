import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}`, config);
        const data = response?.data;
        const list = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data)
          ? data
          : [];
        setEvents(list);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventDate = new Date(event.date);
    const now = new Date();
    
    let matchesFilter = true;
    if (filter === 'upcoming') {
      matchesFilter = eventDate > now;
    } else if (filter === 'past') {
      matchesFilter = eventDate < now;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Navbar />
      
      <main className="flex-grow py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-800 via-purple-700 to-indigo-800 bg-clip-text text-transparent mb-4 drop-shadow-sm">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Browse through our collection of events and find the perfect one for you
            </p>
          </div>

          {/* Search and Filter Container */}
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-violet-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 placeholder-gray-500 shadow-sm hover:shadow-md"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-violet-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-violet-100/30 w-fit">
            <p className="text-violet-700 font-medium">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-violet-100/50">
              <div className="text-6xl mb-4 filter drop-shadow-sm">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back soon for new events'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div
                  key={event._id}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 filter drop-shadow-md hover:drop-shadow-xl"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Events;