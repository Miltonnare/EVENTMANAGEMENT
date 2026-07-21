import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Share2, Users, ArrowRight, Tag } from 'lucide-react';
import SharingTools from './SharingTools';
import EventImage from './EventImage';

const EventCard = ({ event }) => {
  const [showSharing, setShowSharing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const attendeeCount = event.attendees ? event.attendees.length : (event.attendeeCount || 0);
  const capacity = event.capacity;
  const capacityPercent = capacity ? Math.min(100, Math.round((attendeeCount / capacity) * 100)) : null;

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-800/80 group h-full relative">
      {/* Poster Header */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-900">
        <EventImage
          event={event}
          alt={event.title}
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-md shadow-indigo-600/30">
            {event.tags?.[0] || 'Featured'}
          </span>
          <button
            onClick={() => setShowSharing(!showSharing)}
            className="w-9 h-9 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-white/10 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
            title="Share event"
            aria-label="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Date Overlay Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatDate(event.date)}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition line-clamp-2 leading-snug mb-2">
            {event.title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Details Row */}
          <div className="flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            {capacityPercent !== null && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" />
                    Capacity
                  </span>
                  <span className="text-slate-300 font-bold">{attendeeCount} / {capacity}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPercent >= 90
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Share Tray */}
        {showSharing && (
          <div className="mt-2 pt-3 border-t border-slate-800 animate-fade-in">
            <SharingTools eventTitle={event.title} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;