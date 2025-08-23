import { useEffect, useState } from "react";
import axios from "axios";

const OrganizerDashboard = ({ }) => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        image:null
    });
    const [attendees, setAttendees] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
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
            
            const res = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}/mine/me`, config);
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
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",   // ✅ must be multipart
        "Authorization": `Bearer ${token}`,
      },
    };

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("date", formData.date);
    form.append("location", formData.location);
    if (formData.image) {
      form.append("image", formData.image);   
    }

    await axios.post(`${import.meta.env.VITE_API_EVENTS_URL}`, form, config);

    // Reset
    setFormData({ title: "", description: "", date: "", location: "", image: null });
    setShowForm(false);
    fetchMyEvents();
  } catch (error) {
    console.error("Error creating event:", error);
  }
};
    const handleDeleteEvent = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            
            await axios.delete(`${import.meta.env.VITE_API_EVENTS_URL}/${eventId}`, config);
            
            setMyEvents(myEvents.filter(e => e._id !== eventId));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleViewAttendees = async (eventId) => {
        try {
            setSelectedEventId(eventId);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            console.log(import.meta.env.VITE_API_EVENTS_URL)
            const res = await axios.get(`${import.meta.env.VITE_API_EVENTS_URL}/${eventId}/attendees`, config);
            setAttendees(res.data.attendees || []);
        } catch (error) {
            console.error("Error fetching attendees:", error);
        }
    };

    const closeAttendeeList = () => {
        setSelectedEventId(null);
        setAttendees([]);
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
                    <input
                        type="file"
                        name="image"
                        placeholder="choose image"
                        accept="image/*"
                        // value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
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
                            <img 
                            src={`${import.meta.env.VITE_API_URL}/${event.image}`}
                           
                            alt={event.title} 
                            className="w-full h-40 object-cover round mb-4"
                            />
                            {/* console.log(`{import.meta.env.VITE_API_URL}/{event.image}`); */}
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
                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={() => handleViewAttendees(event._id)}
                                >
                                    View Attendees
                                </button>
                            </div>

                            {selectedEventId === event._id && (
                                <div className="mt-4 border-t pt-2">
                                    <h4 className="font-semibold mb-2">Attendees:</h4>
                                    {attendees.length > 0 ? (
                                        <ul className="list-disc list-inside text-gray-700">
                                            {attendees.map(a => (
                                                <li key={a._id}>{a.name} ({a.email})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No attendees yet.</p>
                                    )}
                                    <button
                                        onClick={closeAttendeeList}
                                        className="mt-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
