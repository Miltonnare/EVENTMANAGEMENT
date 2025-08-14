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
          } catch {}
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/events')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
          <button onClick={() => navigate('/events')} className="mb-6 text-blue-600 hover:text-blue-800">
            ← Back to Events
          </button>

          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <div className="text-sm text-gray-600 mb-6">
            <div>Date: {formatDate(event.date)}</div>
            <div>Time: {formatTime(event.date)}</div>
            <div>Location: {event.location}</div>
          </div>

          {isRegistered ? (
            <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancel Registration
            </button>
          ) : (
            <button onClick={handleRegister} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Register for Event
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetail;

 
