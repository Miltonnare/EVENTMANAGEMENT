import { useState } from 'react';
import { Loader2, Ticket } from 'lucide-react';
import { formatPrice, categoryLabel, statusBadgeClass } from '../utils/tickets';

const TicketSelector = ({ ticketTypes, onPurchase, loading }) => {
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selected = ticketTypes.find((t) => t._id === selectedId);
  const activeTypes = ticketTypes.filter((t) => t.status === 'active');

  const handlePurchase = () => {
    if (!selectedId) return;
    onPurchase({ ticketTypeId: selectedId, quantity: Number(quantity) });
  };

  if (!ticketTypes.length) {
    return (
      <p className="text-center text-gray-500 py-4">
        No tickets available for this event yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-violet-800 flex items-center gap-2">
        <Ticket className="w-5 h-5" />
        Select a ticket
      </h3>

      <div className="grid gap-3">
        {ticketTypes.map((tier) => {
          const disabled = tier.status !== 'active';
          const isSelected = selectedId === tier._id;

          return (
            <button
              key={tier._id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setSelectedId(tier._id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                disabled
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'border-violet-600 bg-violet-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-violet-300'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{tier.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                    {categoryLabel(tier.category)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadgeClass(tier.status)}`}
                >
                  {tier.status.replace('_', ' ')}
                </span>
              </div>

              {tier.description && (
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                <span className="font-bold text-violet-700">
                  {formatPrice(tier.currentPrice ?? tier.price)}
                  {tier.dynamicPricing?.enabled && tier.currentPrice !== tier.price && (
                    <span className="text-xs font-normal text-gray-500 ml-1 line-through">
                      {formatPrice(tier.price)}
                    </span>
                  )}
                </span>
                {tier.available != null && (
                  <span className="text-gray-500">{tier.available} left</span>
                )}
                {tier.salesCloseDate && (
                  <span className="text-gray-500">
                    Closes {new Date(tier.salesCloseDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {activeTypes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <label className="text-sm font-medium text-gray-700">
            Quantity
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full sm:w-24 px-3 py-2 border rounded-lg"
              disabled={!selectedId}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handlePurchase}
            disabled={!selectedId || loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Processing...' : 'Get tickets'}
          </button>
        </div>
      )}

      {selected && (
        <p className="text-sm text-gray-600 text-center">
          Total: {formatPrice((selected.currentPrice ?? selected.price) * quantity)}
        </p>
      )}
    </div>
  );
};

export default TicketSelector;
