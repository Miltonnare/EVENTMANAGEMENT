import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../utils/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useEvents = (initialParams = {}) => {
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchEvents = useCallback(async (searchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (searchParams.page) query.append('page', searchParams.page);
      if (searchParams.limit) query.append('limit', searchParams.limit);
      if (searchParams.search) query.append('search', searchParams.search);
      if (searchParams.category && searchParams.category !== 'all') query.append('category', searchParams.category);
      if (searchParams.sortBy) query.append('sortBy', searchParams.sortBy);
      if (searchParams.sortOrder) query.append('sortOrder', searchParams.sortOrder);

      const url = `${API_BASE}/events?${query.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch events');
      }

      setEvents(data.events || data.data || []);
      if (data.meta) setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEvents(params);
  }, [fetchEvents, params]);

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    events,
    meta,
    loading,
    error,
    params,
    updateParams,
    refetch: () => fetchEvents(params),
  };
};
