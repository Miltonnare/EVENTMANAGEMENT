import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
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
        
        const res = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}/${id}`, config);
        setEvent(res.data?.event || null);

        if (token) {
          try {
            const registeredRes = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}/registered/me`, config);
            const registeredEvents = registeredRes.data || [];
            setIsRegistered(registeredEvents.some((e) => e._id === id));
          } catch(error) {
            console.error("Error:",error)
           
          }
        }
      } catch {
        setError('Unable to load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      
      await axios.post(`${import.meta.env.VITE_API_REGISTRATION_URL}/${id}/register`, {}, config);
      setIsRegistered(true);
      alert('Registered successfully');
    } catch (e) {
      alert(e.response?.data?.message || e.message || 'Failed to register');
    }
  };

  const handleCancel = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${import.meta.env.VITE_API_REGISTRATION_URL}/${id}/cancel`, config);
      setIsRegistered(false);
      alert('Registration cancelled');
    } catch (e) {
      alert(e.response?.data?.message || e.message || 'Failed to cancel');
    }
  };

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

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-violet-100/50 max-w-md">
            <div className="text-6xl mb-4 filter drop-shadow-sm">⚠️</div>
            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-800 to-purple-800 bg-clip-text text-transparent">
              Event Not Found
            </h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/events')}
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 font-medium"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/events')} 
            className="mb-6 text-violet-600 hover:text-violet-800 font-medium flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
          >
            <span className="text-lg group-hover:transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to Events
          </button>

          {/* Main Event Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-100/50 p-8 hover:shadow-2xl transition-all duration-300">
            {/* Event Title */}
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-800 via-purple-700 to-indigo-800 bg-clip-text text-transparent leading-tight">
              {event.title}
            </h1>

            {/* Event Description */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
            </div>

            {/* Event Image */}
            {event.image && (
              <div className="mb-8">
                <img 
                  src={`${import.meta.env.VITE_API_URL}/${event.image}`} 
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg border border-violet-200/30"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="mb-8 bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 backdrop-blur-sm rounded-xl p-6 border border-violet-200/30 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 text-center tracking-wide">Event Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-md border border-violet-100/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">Date</div>
                  <div className="text-lg font-extrabold text-gray-800 leading-tight">{formatDate(event.date)}</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-md border border-violet-100/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wider">Time</div>
                  <div className="text-lg font-extrabold text-gray-800 leading-tight">{formatTime(event.date)}</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-md border border-violet-100/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xs font-bold text-violet-600 mb-2 uppercase tracking-wider">Location</div>
                  <div className="text-lg font-extrabold text-gray-800 leading-tight break-words">{event.location}</div>
                </div>
              </div>
            </div>

                         {/* Registration Button */}
             <div className="flex justify-center mb-8">
               {isRegistered ? (
                 <button 
                   onClick={handleCancel} 
                   className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium text-lg min-w-[200px]"
                 >
                   Cancel Registration
                 </button>
               ) : (
                 <button 
                   onClick={handleRegister} 
                   className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 font-medium text-lg min-w-[200px]"
                 >
                   Register for Event
                 </button>
               )}
             </div>

             {/* QR Code Section */}
             {event.qrCode && (
               <div className="border-t border-violet-200/30 pt-8">
                 <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-violet-800 to-purple-800 bg-clip-text text-transparent">
                   Share This Event
                 </h3>
                 <div className="flex flex-col items-center">
                   <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
                     <img 
                       src={event.qrCode} 
                       alt="Event QR Code - Scan to view details" 
                       className="w-48 h-48 object-contain"
                     />
                   </div>
                   <p className="text-gray-600 mt-4 text-center font-medium max-w-md">
                     Scan this QR code to quickly access this event details and share with others
                   </p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;