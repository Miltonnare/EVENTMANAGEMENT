import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import EventImage from "./EventImage";
import PosterUpload from "./PosterUpload";

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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    setMessage("");
    setUploading(true);
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
      setPreviewUrl(null);
      setShowForm(false);
      fetchMyEvents();
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Could not create event"
      );
      console.error("Error creating event:", error);
    } finally {
      setUploading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl font-medium">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-white">Your Events</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`mb-6 px-5 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 
            ${showForm
              ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
              : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"}`}
        >
          {showForm ? "Cancel" : "Create New Event"}
        </button>

        {/* Error/Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        {showForm && (
          <div className="mb-8 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
            ></textarea>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleInputChange}
              className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />

            <PosterUpload
              file={formData.image}
              previewUrl={previewUrl}
              disabled={uploading}
              onFileChange={(file, url) => {
                setFormData({ ...formData, image: file });
                setPreviewUrl(url);
              }}
              onClear={() => {
                setFormData({ ...formData, image: null });
                setPreviewUrl(null);
              }}
            />

            <button
              onClick={handleCreateEvent}
              disabled={uploading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading poster..." : "Save Event"}
            </button>
          </div>
        )}

        {myEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
              <p className="text-white text-lg font-medium">No events created yet.</p>
              <p className="text-white/70 mt-2">Click "Create New Event" to get started!</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-4 w-full flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
              >
                <EventImage
                  event={event}
                  alt={event.title}
                  wrapperClassName="w-full h-40 rounded-lg mb-4 shadow-md overflow-hidden"
                  className="w-full h-40 object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 flex-grow">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {new Date(event.date).toDateString()} @ {event.location}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => console.log("Edit event", event._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => handleViewAttendees(event._id)}
                  >
                    View Attendees
                  </button>
                </div>

                {selectedEventId === event._id && (
                  <div className="mt-4 border-t pt-4 bg-gray-50/80 rounded-lg p-3 -mx-1">
                    <h4 className="font-semibold mb-2 text-gray-800">Attendees:</h4>
                    {attendees.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {attendees.map((a) => (
                          <li key={a._id} className="text-sm">
                            {a.name} ({a.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm">No attendees yet.</p>
                    )}
                    <button
                      onClick={closeAttendeeList}
                      className="mt-3 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
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
    </div>
  );
};

export default OrganizerDashboard;