import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventImage from '../components/EventImage';
import TicketSelector from '../components/TicketSelector';
import Navbar from '../components/Navbar';
import { getAuthHeaders } from '../utils/auth';
import { fetchTicketTypes, purchaseTickets } from '../utils/tickets';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const config = { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) };
        const res = await axios.get(
          `${import.meta.env.VITE_API_EVENTS_URL}/${id}`,
          config
        );
        const eventData = res.data?.event || null;
        setEvent(eventData);
        setTicketTypes(eventData?.ticketTypes || (await fetchTicketTypes(id)));

        if (localStorage.getItem('token')) {
          try {
            const registeredRes = await axios.get(
              `${import.meta.env.VITE_API_EVENTS_URL}/registered/me`,
              config
            );
            const registeredEvents = registeredRes.data || [];
            setIsRegistered(registeredEvents.some((e) => e._id === id));

            const ticketsRes = await axios.get(
              `${import.meta.env.VITE_API_TICKETS_URL}/my`,
              config
            );
            const mine = (ticketsRes.data.tickets || []).filter(
              (t) => t.event?._id === id && t.status === 'valid'
            );
            setUserTickets(mine);
          } catch (err) {
            console.error('Error loading registration:', err);
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

  const handlePurchase = async ({ ticketTypeId, quantity }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      await purchaseTickets({ eventId: id, ticketTypeId, quantity });
      setIsRegistered(true);
      const types = await fetchTicketTypes(id);
      setTicketTypes(types);
      alert('Tickets purchased successfully!');
      navigate('/my-tickets');
    } catch (e) {
      alert(e.response?.data?.message || e.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancel = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_REGISTRATION_URL}/${id}/cancel`,
        { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
      );
      setIsRegistered(false);
      setUserTickets([]);
      setTicketTypes(await fetchTicketTypes(id));
      alert('Registration cancelled');
    } catch (e) {
      alert(e.response?.data?.message || e.message || 'Failed to cancel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="text-violet-600 font-medium">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-violet-100/50 max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 text-violet-800">
                Event Not Found
              </h1>
              <button
                onClick={() => navigate('/events')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Navbar />
      <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/events')}
            className="mb-4 sm:mb-6 text-violet-600 hover:text-violet-800 font-medium flex items-center gap-2"
          >
            ← Back to Events
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-100/50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-violet-800 to-indigo-800 bg-clip-text text-transparent">
              {event.title}
            </h1>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
              {event.description}
            </p>

            <div className="mb-6 sm:mb-8">
              <div className="w-full h-48 sm:h-64 lg:h-80 overflow-hidden rounded-xl shadow-lg border border-violet-200/30 bg-gray-100">
                <EventImage
                  event={event}
                  alt={event.title}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  size="large"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            </div>

            <div className="mb-6 sm:mb-8 bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 text-center">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/95 rounded-xl p-4">
                  <div className="text-xs font-bold text-indigo-600 mb-1">DATE</div>
                  <div className="font-bold text-gray-800">{formatDate(event.date)}</div>
                </div>
                <div className="bg-white/95 rounded-xl p-4">
                  <div className="text-xs font-bold text-purple-600 mb-1">TIME</div>
                  <div className="font-bold text-gray-800">{formatTime(event.date)}</div>
                </div>
                <div className="bg-white/95 rounded-xl p-4">
                  <div className="text-xs font-bold text-violet-600 mb-1">LOCATION</div>
                  <div className="font-bold text-gray-800 break-words">{event.location}</div>
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-xl border border-violet-200 shadow-sm">
              {isRegistered ? (
                <div className="space-y-4">
                  <p className="text-green-700 font-medium text-center">
                    You have tickets for this event
                  </p>
                  {userTickets.map((t) => (
                    <div
                      key={t._id}
                      className="p-3 bg-violet-50 rounded-lg flex justify-between items-center text-sm"
                    >
                      <span className="font-mono text-violet-700">{t.ticketCode}</span>
                      <span className="text-gray-600">{t.ticketType?.name}</span>
                    </div>
                  ))}
                  <button
                    onClick={handleCancel}
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
                  >
                    Cancel registration
                  </button>
                </div>
              ) : (
                <TicketSelector
                  ticketTypes={ticketTypes}
                  onPurchase={handlePurchase}
                  loading={purchasing}
                />
              )}
            </div>

            {event.qrCode && (
              <div className="border-t border-violet-200/30 pt-6 text-center">
                <h3 className="text-lg font-bold text-violet-800 mb-4">Share This Event</h3>
                <img
                  src={event.qrCode}
                  alt="Event QR Code"
                  className="w-40 h-40 mx-auto border rounded-xl p-2 bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
