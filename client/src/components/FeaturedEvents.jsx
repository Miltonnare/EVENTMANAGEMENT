import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import SkeletonLoader from './SkeletonLoader';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

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
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const upcomingEvents = allEvents
          .filter((event) => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6);

        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <section className="py-12 px-4 sm:px-8 w-full flex flex-col gap-10">
      <div className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Featured Highlights
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Upcoming Events
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl">
          Discover handpicked tech meetups, workshops, and high-impact conferences happening soon.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={3} type="card" />
      ) : events.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Upcoming Events</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Check back soon for new event announcements or host your own!
          </p>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
          >
            Create an Event
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition transform active:scale-95 shadow-xl"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvents;