import { useEffect, useState } from "react";
import axios from "axios";

const AttendeeDashboard = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegisteredEvents();
    }, []);

    const fetchRegisteredEvents = async () => {
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
            
            const res = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}/registered/me`, config);
            setRegisteredEvents(res.data.events.events || []);
            console.log(res.data.events);
        } catch (error) {
            console.error("Error fetching registered events:", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelRegistration = async (eventId) => {
        if (!window.confirm("Are you sure you want to cancel this registration?")) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            
            await axios.delete(`${import.meta.env.VITE_API_REGISTRATION_URL}/${eventId}/cancel`, config);
            
            // Refresh the list after cancellation
            setRegisteredEvents(prev => prev.filter(e => e._id !== eventId));
        } catch (error) {
            console.error("Error canceling registration:", error);
        }
    };

    if (loading) return <p>Loading your registered events...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>

            {registeredEvents.length === 0 ? (
                <p>You haven't registered for any events yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map(event => (
                        <div key={event._id} className="bg-white shadow rounded p-4">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(event.date).toDateString()} @ {event.location}
                            </p>

                            <button
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => cancelRegistration(event._id)}
                            >
                                Cancel Registration
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AttendeeDashboard;
