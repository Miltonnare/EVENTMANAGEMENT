import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { useEvents } from '../hooks/useEvents';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'Tech', label: 'Technology' },
  { id: 'Music', label: 'Music & Festivals' },
  { id: 'Business', label: 'Business & Networking' },
  { id: 'Workshop', label: 'Workshops' },
  { id: 'Sports', label: 'Sports & Fitness' },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, upcoming, past

  const { events, meta, loading, error, updateParams, refetch } = useEvents({
    page: 1,
    limit: 12,
    search: '',
    category: 'all',
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    updateParams({ search: val, page: 1 });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    updateParams({ category: catId, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      updateParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Client-side date filter (upcoming vs past)
  const displayedEvents = events.filter((evt) => {
    if (!evt.date) return true;
    const evtDate = new Date(evt.date);
    const now = new Date();
    if (filterType === 'upcoming') return evtDate >= now;
    if (filterType === 'past') return evtDate < now;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
        {/* Header Title */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore Events & Experience Tech
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Filter upcoming meetups, conferences, workshops, and concerts near you or online.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col gap-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, location, or keyword..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-indigo-500 transition"
              />
            </div>

            {/* Filter Dropdown & Reset */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl px-3 py-2 text-sm text-slate-300">
                <Filter className="w-4 h-4 text-indigo-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Timeline</option>
                  <option value="upcoming" className="bg-slate-900">Upcoming Only</option>
                  <option value="past" className="bg-slate-900">Past Events</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setFilterType('all');
                  updateParams({ search: '', category: 'all', page: 1 });
                }}
                className="p-3 rounded-2xl glass-panel hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-slate-800/80">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <SkeletonLoader count={6} type="card" />
        ) : error ? (
          <div className="glass-panel p-8 text-center rounded-3xl border border-red-500/20 text-red-300">
            <p className="font-semibold mb-2">Failed to load events</p>
            <p className="text-xs text-red-400 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : displayedEvents.length === 0 ? (
          <EmptyState
            type="search"
            title="No events match your search"
            description="Try adjusting your category filter, clearing search keywords, or selecting another timeline."
            actionText="Clear Search"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setFilterType('all');
              updateParams({ search: '', category: 'all', page: 1 });
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination controls */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Page <strong className="text-slate-200">{meta.page}</strong> of <strong className="text-slate-200">{meta.totalPages}</strong> ({meta.total} events)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                    className="p-2.5 rounded-xl glass-panel hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                    className="p-2.5 rounded-xl glass-panel hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Events;