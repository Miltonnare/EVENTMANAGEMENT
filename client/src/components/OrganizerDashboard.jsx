import { useEffect, useState } from "react";
import axios from "axios";

const OrganizerDashboard = ({ user }) => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: ""
    });

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/events/mine", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyEvents(res.data || []);
        } catch (error) {
            console.error("Error fetching my events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/events", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ title: "", description: "", date: "", location: "" });
            setShowForm(false);
            fetchMyEvents();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyEvents(myEvents.filter(e => e._id !== eventId));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    if (loading) return <p>Loading your events...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Events</h2>

            <button
                onClick={() => setShowForm(!showForm)}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                {showForm ? "Cancel" : "Create New Event"}
            </button>

            {showForm && (
                <div className="mb-6 p-4 border rounded">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded"
                    ></textarea>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="block w-full mb-4 p-2 border rounded"
                    />
                    <button
                        onClick={handleCreateEvent}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Event
                    </button>
                </div>
            )}

            {myEvents.length === 0 ? (
                <p>No events created yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEvents.map(event => (
                        <div key={event._id} className="bg-white shadow rounded p-4">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(event.date).toDateString()} @ {event.location}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    onClick={() => console.log("Edit event", event._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={() => handleDeleteEvent(event._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
