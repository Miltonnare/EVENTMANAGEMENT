import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Loader2 } from 'lucide-react';
import { getAuthHeaders } from '../utils/auth';
import { formatPrice, categoryLabel, statusBadgeClass } from '../utils/tickets';

const emptyForm = {
  name: '',
  category: 'paid',
  description: '',
  price: 0,
  quantity: '',
  salesCloseDate: '',
  dynamicPricing: { enabled: false, increasePerTenPercentSold: 5 },
};

const TicketTypeManager = ({ eventId }) => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const eventsUrl = import.meta.env.VITE_API_EVENTS_URL;

  const loadTypes = async () => {
    try {
      const res = await axios.get(`${eventsUrl}/${eventId}/ticket-types`);
      setTypes(res.data.ticketTypes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) loadTypes();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${eventsUrl}/${eventId}/ticket-types`,
        {
          ...form,
          price: Number(form.price),
          quantity: form.quantity ? Number(form.quantity) : null,
          salesCloseDate: form.salesCloseDate || null,
        },
        { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
      );
      setForm(emptyForm);
      setShowForm(false);
      loadTypes();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setSaving(false);
    }
  };

  if (!eventId) return null;

  return (
    <div className="mt-4 p-4 bg-violet-50 rounded-xl border border-violet-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-violet-900">Ticket tiers</h4>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800"
        >
          <Plus className="w-4 h-4" />
          Add tier
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading tickets...</p>
      ) : types.length === 0 ? (
        <p className="text-sm text-gray-500">No ticket tiers configured.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {types.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center text-sm bg-white p-2 rounded-lg"
            >
              <span>
                {t.name} ({categoryLabel(t.category)}) — {formatPrice(t.currentPrice ?? t.price)}
                {t.available != null && ` · ${t.available} left`}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(t.status)}`}>
                {t.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            className="w-full p-2 border rounded-lg"
            placeholder="Tier name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="w-full p-2 border rounded-lg"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="vip">VIP</option>
            <option value="early_bird">Early Bird</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 border rounded-lg"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            min="1"
            className="w-full p-2 border rounded-lg"
            placeholder="Quantity (optional)"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full p-2 border rounded-lg"
            value={form.salesCloseDate}
            onChange={(e) => setForm({ ...form, salesCloseDate: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.dynamicPricing.enabled}
              onChange={(e) =>
                setForm({
                  ...form,
                  dynamicPricing: {
                    ...form.dynamicPricing,
                    enabled: e.target.checked,
                  },
                })
              }
            />
            Dynamic pricing
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-violet-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save tier
          </button>
        </form>
      )}
    </div>
  );
};

export default TicketTypeManager;
