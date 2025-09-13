import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SharingTools from './SharingTools';

const EventCard = ({ event }) => {
  const [showSharing, setShowSharing] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto sm:max-w-none bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-violet-200/50 group hover:border-violet-300/70 transform hover:-translate-y-2 hover:scale-[1.02]">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-3 sm:p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex-1 pr-2 sm:pr-4">
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight tracking-wide group-hover:text-violet-100 transition-colors duration-300 line-clamp-2">
              {event.title}
            </h3>
          </div>
          <button
            onClick={() => setShowSharing(!showSharing)}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 flex-shrink-0"
            title="Share event"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
      
     
      <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
        {/* Replace your image rendering with this safer approach: */}
        {event.image && (
          <img
            src={event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_URL}/${event.image}`}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-2xl"
            onError={(e) => {
              e.target.style.display = 'none';
              console.warn('Failed to load image:', event.image);
            }}
          />
        )}

        {/* Fallback when no image is available */}
        {!event.image && (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-2xl flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      {/* console.log("Events Image:", `${import.meta.env.VITE_API_URL}/${event.image}`); */}

      <div className="p-4 sm:p-6">
       
        <p className="text-gray-700 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base leading-relaxed font-medium">
          {event.description}
        </p>
        
        {/* Date and Time Info */}
        <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-violet-100 to-purple-100 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-violet-200/50 shadow-sm">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-1.5 sm:p-2 rounded-lg shadow-md flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Date</div>
              <span className="text-xs sm:text-sm font-black text-gray-800 leading-tight block">{formatDate(event.date)}</span>
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-purple-200/50 shadow-sm">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1.5 sm:p-2 rounded-lg shadow-md flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Time</div>
              <span className="text-xs sm:text-sm font-black text-gray-800 leading-tight block">{formatTime(event.date)}</span>
            </div>
          </div>
        </div>
        
        {/* QR Code Section - Enhanced styling */}
        {
          event.qrCode && (
            <div className='mt-4 flex flex-col items-center'>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200/50">
                <img 
                  src={event.qrCode} 
                  alt="Event QR Code - Scan to view details" 
                  className='w-24 h-24 border-2 border-blue-200 sm:w-28 sm:h-28 object-contain'
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                Scan to view event details
              </p>
            </div>
          )
        }
        
        {/* Action Buttons - Made responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 text-center font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            View Details
          </Link>
          <button
            onClick={() => navigate(`/events/${event._id}`)}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-violet-300 text-violet-700 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-violet-50 hover:border-violet-400 hover:text-violet-800 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Register
          </button>
        </div>
      </div>
      
      {/* Sharing Section */}
      {showSharing && (
        <div className="border-t border-violet-200/50 bg-gradient-to-r from-violet-50/80 to-purple-50/80 backdrop-blur-sm p-3 sm:p-4">
          <SharingTools eventTitle={event.title} />
        </div>
      )}
    </div>
  );
};

export default EventCard;