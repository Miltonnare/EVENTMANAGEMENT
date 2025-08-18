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
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-700 bg-clip-text mb-6 tracking-tight leading-tight">
              Featured Upcoming Events
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
              Discover the most exciting events happening soon
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 shadow-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-sky-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Featured Events</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-700 bg-clip-text mb-6 tracking-tight leading-tight">
            Upcoming Events
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
            Discover the most exciting events happening soon. Don't miss out on these amazing opportunities!
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-xl">
            <div className="text-8xl mb-6 filter drop-shadow-lg">📅</div>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-wide">
              No Upcoming Events
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Check back soon for exciting new events, or be the first to create one!
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-white font-bold text-lg"
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
                  className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 filter drop-shadow-md hover:drop-shadow-xl"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-blue-200/50 hover:border-blue-300/60 transition-all duration-300 shadow-sm hover:shadow-lg">
                    <EventCard event={event} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Events Button */}
            <div className="text-center">
              <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-blue-200/50 shadow-lg">
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-white to-blue-50 text-blue-700 px-10 py-4 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-white font-black text-lg tracking-wide group"
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