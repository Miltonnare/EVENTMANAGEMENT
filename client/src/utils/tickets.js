import axios from 'axios';
import { getAuthHeaders } from './auth';

const ticketsUrl = import.meta.env.VITE_API_TICKETS_URL;
const eventsUrl = import.meta.env.VITE_API_EVENTS_URL;
const registrationUrl = import.meta.env.VITE_API_REGISTRATION_URL;

export const fetchTicketTypes = async (eventId) => {
  const res = await axios.get(`${eventsUrl}/${eventId}/ticket-types`);
  return res.data.ticketTypes || [];
};

export const purchaseTickets = async ({ eventId, ticketTypeId, quantity = 1 }) => {
  const res = await axios.post(
    `${ticketsUrl}/purchase`,
    { eventId, ticketTypeId, quantity },
    { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
  );
  return res.data;
};

export const registerForEvent = async (eventId, payload = {}) => {
  const res = await axios.post(
    `${registrationUrl}/${eventId}/register`,
    payload,
    { headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
  );
  return res.data;
};

export const fetchMyTickets = async () => {
  const res = await axios.get(`${ticketsUrl}/my`, {
    headers: getAuthHeaders(),
  });
  return res.data.tickets || [];
};

export const fetchPurchaseHistory = async () => {
  const res = await axios.get(`${ticketsUrl}/history`, {
    headers: getAuthHeaders(),
  });
  return res.data.purchases || [];
};

export const downloadTicket = async (ticketId) => {
  const res = await axios.get(`${ticketsUrl}/${ticketId}/download`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const formatPrice = (amount) =>
  amount === 0 ? 'Free' : `$${Number(amount).toFixed(2)}`;

export const categoryLabel = (category) => {
  const labels = {
    free: 'Free',
    paid: 'Standard',
    vip: 'VIP',
    early_bird: 'Early Bird',
  };
  return labels[category] || category;
};

export const statusBadgeClass = (status) => {
  const map = {
    active: 'bg-green-100 text-green-800',
    sold_out: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-600',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};
