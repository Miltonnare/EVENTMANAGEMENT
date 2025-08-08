import { useEffect, useState } from "react";
import axios from "axios";

const AttendeeDashboard = ({ user }) => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/users/me/registrations", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRegisteredEvents(res.data || []);
            } catch (error) {
                console.error("Error fetching registered events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegisteredEvents();
    }, []);

    if (loading) return <p>Loading your registered events...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Registered Events</h2>
            {registeredEvents.length === 0 ? (
                <p>You haven't registered for any events yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map(event => (
                        <div key={event._id} className="bg-white shadow rounded p-4">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(event.date).toDateString()}
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => console.log("Cancel registration for", event._id)}
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
