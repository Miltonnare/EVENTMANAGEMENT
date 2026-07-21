import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventImage from '../components/EventImage';
import TicketSelector from '../components/TicketSelector';
import SkeletonLoader from '../components/SkeletonLoader';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { getAuthHeaders } from '../utils/auth';
import { fetchTicketTypes, purchaseTickets } from '../utils/tickets';
import { Calendar, Clock, MapPin, ArrowLeft, Ticket as TicketIcon, QrCode, ShieldCheck, UserCheck } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const config = { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) };
        const res = await axios.get(
          `${import.meta.env.VITE_API_EVENTS_URL}/${id}`,
          config
        );
        const eventData = res.data?.event || res.data?.data || null;
        setEvent(eventData);

        const types = eventData?.ticketTypes || (await fetchTicketTypes(id));
        setTicketTypes(types);

        if (isAuthenticated) {
          try {
            const registeredRes = await axios.get(
              `${import.meta.env.VITE_API_EVENTS_URL}/registered/me`,
              config
            );
            const registeredEvents = registeredRes.data?.events || registeredRes.data?.data || registeredRes.data || [];
            setIsRegistered(registeredEvents.some((e) => e._id === id));

            const ticketsRes = await axios.get(
              `${import.meta.env.VITE_API_TICKETS_URL}/my`,
              config
            );
            const mine = (ticketsRes.data?.tickets || ticketsRes.data?.data || []).filter(
              (t) => (t.event?._id || t.event) === id && t.status === 'valid'
            );
            setUserTickets(mine);
          } catch (err) {
            console.error('Error fetching user registrations:', err);
          }
        }
      } catch (err) {
        showToast('Unable to load event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isAuthenticated, showToast]);

  const handlePurchase = async ({ ticketTypeId, quantity }) => {
    if (!isAuthenticated) {
      showToast('Please log in to purchase tickets', 'info');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setPurchasing(true);
    try {
      await purchaseTickets({ eventId: id, ticketTypeId, quantity });
      setIsRegistered(true);
      const types = await fetchTicketTypes(id);
      setTicketTypes(types);
      showToast('Tickets purchased successfully!', 'success');
      navigate('/my-tickets');
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || 'Purchase failed';
      showToast(msg, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancelRegistration = async () => {
    setCancelling(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_REGISTRATION_URL}/${id}/cancel`,
        { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
      );
      setIsRegistered(false);
      setUserTickets([]);
      const types = await fetchTicketTypes(id);
      setTicketTypes(types);
      showToast('Registration cancelled successfully', 'info');
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to cancel registration';
      showToast(msg, 'error');
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8">
          <SkeletonLoader count={1} type="detail" />
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-3xl text-center max-w-md w-full border border-slate-800">
            <h2 className="text-xl font-bold text-slate-100 mb-2">Event Not Found</h2>
            <p className="text-slate-400 text-sm mb-6">The event you are looking for may have been removed or does not exist.</p>
            <Link
              to="/events"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold inline-block"
            >
              Back to Events
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        {/* Event Header Banner */}
        <div className="relative w-full h-80 rounded-3xl overflow-hidden glass-panel border border-slate-800">
          <EventImage
            event={event}
            alt={event.title}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
            <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold w-fit shadow-md">
              {event.tags?.[0] || 'Event Details'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
              <p className="text-sm font-bold text-slate-200">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Time</p>
              <p className="text-sm font-bold text-slate-200">{formatTime(event.date)}</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-bold text-slate-200 truncate">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Layout Split: Description & Ticket Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Description & Organizer Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white">About This Event</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                    {event.organizer.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Organized by</p>
                    <p className="text-sm font-bold text-slate-200">{event.organizer.name}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Organizer
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Tickets Selector / Ticket Wallet Status */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
              {isRegistered ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                    <UserCheck className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">You're Registered!</p>
                      <p className="text-[11px] text-emerald-300/80">Your digital ticket is ready.</p>
                    </div>
                  </div>

                  {userTickets.map((t) => (
                    <div key={t._id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-indigo-300">{t.ticketType?.name || 'Standard'}</p>
                        <p className="font-mono text-slate-400 text-[10px]">{t.ticketCode}</p>
                      </div>
                      <Link
                        to="/my-tickets"
                        className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg transition text-[11px] font-semibold"
                      >
                        View Ticket
                      </Link>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition mt-2 cursor-pointer"
                  >
                    Cancel Registration
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

            {/* QR Code Container */}
            {event.qrCode && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  Event Access QR
                </div>
                <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200">
                  <img src={event.qrCode} alt="Event QR Code" className="w-36 h-36 object-contain" />
                </div>
                <p className="text-[11px] text-slate-400">Scan code to open on mobile device</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel Registration"
        message="Are you sure you want to cancel your ticket registration for this event?"
        confirmText="Yes, Cancel Registration"
        isDanger={true}
        loading={cancelling}
        onConfirm={handleCancelRegistration}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default EventDetail;
