import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Ticket, History } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  fetchMyTickets,
  fetchPurchaseHistory,
  downloadTicket,
  formatPrice,
  categoryLabel,
} from '../utils/tickets';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tab, setTab] = useState('tickets');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p] = await Promise.all([fetchMyTickets(), fetchPurchaseHistory()]);
        setTickets(t);
        setPurchases(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    } catch {
      alert('Unable to download ticket');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-violet-900 mb-6">My Tickets</h1>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              tab === 'tickets' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              tab === 'history' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <History className="w-4 h-4" />
            Purchase history
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tab === 'tickets' ? (
          tickets.length === 0 ? (
            <p className="text-gray-600">
              No tickets yet.{' '}
              <Link to="/events" className="text-violet-600 hover:underline">
                Browse events
              </Link>
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white rounded-xl shadow-md p-5 border border-violet-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-sm text-violet-600">{ticket.ticketCode}</p>
                      <p className="font-semibold text-lg">{ticket.event?.title}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === 'valid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {categoryLabel(ticket.ticketType?.category)} ·{' '}
                    {formatPrice(ticket.pricePaid)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {ticket.event?.date &&
                      new Date(ticket.event.date).toLocaleString()}{' '}
                    · {ticket.event?.location}
                  </p>
                  {ticket.qrCode && (
                    <img
                      src={ticket.qrCode}
                      alt="Ticket QR"
                      className="w-24 h-24 mx-auto mt-3 border rounded-lg"
                    />
                  )}
                  {ticket.status === 'valid' && (
                    <button
                      type="button"
                      onClick={() => handleDownload(ticket._id, ticket.ticketCode)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-violet-300 text-violet-700 rounded-lg hover:bg-violet-50"
                    >
                      <Download className="w-4 h-4" />
                      Download ticket
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        ) : purchases.length === 0 ? (
          <p className="text-gray-600">No purchase history.</p>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow p-4 border border-gray-100"
              >
                <p className="font-semibold">{p.event?.title}</p>
                <p className="text-sm text-gray-600">
                  {p.ticketType?.name} ({categoryLabel(p.ticketType?.category)}) × {p.quantity}
                </p>
                <p className="text-sm text-violet-700 font-medium mt-1">
                  {formatPrice(p.totalAmount)} · {p.status}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(p.purchasedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTickets;
