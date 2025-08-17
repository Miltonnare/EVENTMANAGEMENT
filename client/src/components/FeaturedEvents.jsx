import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}`);
        const data = response?.data;
        const allEvents = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data)
          ? data
          : [];
        
        // Filter for upcoming events and sort by date
        const upcomingEvents = allEvents
          .filter(event => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6); // Show only 6 featured events
        
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text mb-6 tracking-tight leading-tight">
              Featured Upcoming Events
            </h2>
            <p className="text-xl md:text-2xl text-violet-100 max-w-4xl mx-auto font-medium leading-relaxed">
              Discover the most exciting events happening soon
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-300 shadow-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-bold text-violet-200 uppercase tracking-widest">Featured Events</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text mb-6 tracking-tight leading-tight">
            Upcoming Events
          </h2>
          <p className="text-xl md:text-2xl text-violet-100 max-w-4xl mx-auto font-medium leading-relaxed">
            Discover the most exciting events happening soon. Don't miss out on these amazing opportunities!
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
            <div className="text-8xl mb-6 filter drop-shadow-lg">📅</div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-wide">
              No Upcoming Events
            </h3>
            <p className="text-xl text-violet-200 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Check back soon for exciting new events, or be the first to create one!
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent font-bold text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {events.map(event => (
                <div 
                  key={event._id} 
                  className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 filter drop-shadow-xl hover:drop-shadow-2xl"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <EventCard event={event} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Events Button */}
            <div className="text-center">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-white to-violet-100 text-violet-800 px-10 py-4 rounded-xl hover:from-violet-50 hover:to-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent font-black text-lg tracking-wide"
                >
                  <span>View All Events</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;