import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  fetchMyTickets,
  fetchPurchaseHistory,
  downloadTicket,
  formatPrice,
  categoryLabel,
} from '../utils/tickets';
import { Ticket, History, Download, QrCode, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const MyTickets = () => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tab, setTab] = useState('tickets');
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p] = await Promise.all([fetchMyTickets(), fetchPurchaseHistory()]);
        setTickets(t || []);
        setPurchases(p || []);
      } catch (err) {
        showToast('Failed to load tickets', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showToast]);

  const handleDownload = async (ticketId, ticketCode) => {
    try {
      const data = await downloadTicket(ticketId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticketCode}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Digital ticket downloaded', 'success');
    } catch {
      showToast('Unable to download ticket', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Digital Ticket Wallet</h1>
            <p className="text-xs sm:text-sm text-slate-400">View pass codes, download tickets, or inspect purchase history.</p>
          </div>

          {/* Tabs switch */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                tab === 'tickets'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              Active Pass ({tickets.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                tab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Order History ({purchases.length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <SkeletonLoader count={4} type="card" />
        ) : tab === 'tickets' ? (
          tickets.length === 0 ? (
            <EmptyState
              type="tickets"
              actionText="Explore Events"
              onAction={() => (window.location.href = '/events')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-indigo-400 font-bold tracking-wider uppercase">
                        {ticket.ticketCode}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 line-clamp-1 mt-0.5">
                        {ticket.event?.title || 'Event Pass'}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {ticket.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-slate-400 py-2 border-y border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ticket.event?.date ? new Date(ticket.event.date).toLocaleString() : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span className="truncate">{ticket.event?.location || 'Venue'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 font-semibold pt-1">
                      <span>Type: {categoryLabel(ticket.ticketType?.category)}</span>
                      <span className="text-indigo-300 font-bold">{formatPrice(ticket.pricePaid)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {ticket.qrCode && (
                      <button
                        onClick={() => setSelectedQr(ticket)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-indigo-400" />
                        Show QR Pass
                      </button>
                    )}
                    {ticket.status === 'valid' && (
                      <button
                        onClick={() => handleDownload(ticket._id, ticket.ticketCode)}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download Pass
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : purchases.length === 0 ? (
          <EmptyState
            type="tickets"
            title="No Purchase History"
            description="You haven't made any ticket purchases yet."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {purchases.map((p) => (
              <div
                key={p._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-100 text-base">{p.event?.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {p.ticketType?.name} ({categoryLabel(p.ticketType?.category)}) × {p.quantity} ticket(s)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(p.purchasedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <span className="text-sm font-black text-indigo-300">{formatPrice(p.totalAmount)}</span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Code Pass Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-sm w-full rounded-3xl p-6 border border-slate-800 text-center flex flex-col items-center gap-4 relative">
            <h3 className="text-lg font-bold text-white">{selectedQr.event?.title}</h3>
            <p className="font-mono text-xs text-indigo-400 font-bold">{selectedQr.ticketCode}</p>
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
              <img src={selectedQr.qrCode} alt="Ticket QR" className="w-48 h-48 object-contain" />
            </div>
            <p className="text-xs text-slate-400">Present this QR code at venue entrance for scanner verification.</p>
            <button
              onClick={() => setSelectedQr(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
