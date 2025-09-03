import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const OrganizerDashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });
  const [attendees, setAttendees] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      if (token) config.headers.Authorization = `Bearer ${token}`;

      const res = await axios.get(
        `${import.meta.env.VITE_API_EVENTS_URL}/mine/me`,
        config
      );
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
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("date", formData.date);
      form.append("location", formData.location);
      if (formData.image) form.append("image", formData.image);

      await axios.post(`${import.meta.env.VITE_API_EVENTS_URL}`, form, config);

      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        image: null,
      });
      setShowForm(false);
      fetchMyEvents();
    } catch (error) {
        setMessage("Could not Create Event");
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${import.meta.env.VITE_API_EVENTS_URL}/${eventId}`,
        config
      );

      setMyEvents(myEvents.filter((e) => e._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      setSelectedEventId(eventId);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_API_EVENTS_URL}/${eventId}/attendees`,
        config
      );
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Events</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className={`mb-6 px-5 py-2.5 rounded-lg font-medium shadow-md transition 
          ${showForm
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-green-600 text-white hover:bg-green-700"}`}
      >
        {showForm ? "Cancel" : "Create New Event"}
      </button>

      {showForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* ✅ File upload + preview */}
          <div className="mb-6">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="block w-full mb-3 cursor-pointer text-sm text-gray-500 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-lg file:border-0 
                        file:text-sm file:font-medium 
                        file:bg-blue-600 file:text-white 
                        hover:file:bg-blue-700 
                        focus:outline-none"
            />

            {formData.image && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleCreateEvent}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
          >
            Save Event
          </button>
        </div>
      )}

      {myEvents.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl p-4 w-full flex flex-col"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/${event.image}`}
                alt={event.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {event.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(event.date).toDateString()} @ {event.location}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                  onClick={() => console.log("Edit event", event._id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
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
                      {attendees.map((a) => (
                        <li key={a._id}>
                          {a.name} ({a.email})
                        </li>
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
