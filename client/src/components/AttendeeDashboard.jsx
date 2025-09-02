import { useEffect, useState } from "react";
import { Calendar, MapPin, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

const AttendeeDashboard = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelingEventId, setCancelingEventId] = useState(null);
    const [successfullyRegistered, setSuccessfullyRegistered] = useState(new Set());
    const [recentlyCanceled, setRecentlyCanceled] = useState(new Set());

    useEffect(() => {
        fetchRegisteredEvents();
    }, []);

    useEffect(() => {
        // Clear success messages after 3 seconds
        if (recentlyCanceled.size > 0) {
            const timer = setTimeout(() => {
                setRecentlyCanceled(new Set());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlyCanceled]);

    const fetchRegisteredEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            
            const res = await fetch(`${import.meta.env.VITE_API_EVENTS_URL}/registered/me`, {
                method: 'GET',
                headers
            });
            
            const data = await res.json();
            console.log("API Response:", data);
            setRegisteredEvents(data || []);
            
            // Mark all fetched events as successfully registered
            setSuccessfullyRegistered(new Set((data || []).map(e => e._id)));

        } catch (error) {
            console.error("Error fetching registered events:", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelRegistration = async (eventId) => {
        if (!window.confirm("Are you sure you want to cancel this registration?")) return;

        setCancelingEventId(eventId);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            
            await fetch(`${import.meta.env.VITE_API_REGISTRATION_URL}/${eventId}/cancel`, {
                method: 'DELETE',
                headers
            });
            
            // Add to recently canceled set for feedback
            setRecentlyCanceled(prev => new Set([...prev, eventId]));
            
            // Remove from successfully registered
            setSuccessfullyRegistered(prev => {
                const newSet = new Set(prev);
                newSet.delete(eventId);
                return newSet;
            });
            
            // Refresh the list after cancellation with a small delay for UX
            setTimeout(() => {
                setRegisteredEvents(prev => prev.filter(e => e._id !== eventId));
            }, 500);
            
        } catch (error) {
            console.error("Error canceling registration:", error);
        } finally {
            setCancelingEventId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 text-lg">Loading your registered events...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">My Registered Events</h2>
                <p className="text-gray-600">Manage your event registrations and attendance</p>
            </div>

            {registeredEvents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
                        <p className="text-gray-600">You haven't registered for any events yet. Browse available events to get started!</p>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map(event => {
                        const isCanceling = cancelingEventId === event._id;
                        const isRecentlyCanceled = recentlyCanceled.has(event._id);
                        const isSuccessfullyRegistered = successfullyRegistered.has(event._id) && !isRecentlyCanceled;
                        
                        return (
                            <div 
                                key={event._id} 
                                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                                    isRecentlyCanceled ? 'border-red-200 opacity-75' : 'border-gray-100'
                                }`}
                            >
                                {event.image && (
                                    <div className="relative">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/${event.image}`}
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        {isSuccessfullyRegistered && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-lg">
                                                <CheckCircle className="w-4 h-4" />
                                                Registered
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                    
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                                weekday: 'short', 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {isRecentlyCanceled ? (
                                            <div className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                                                <X className="w-4 h-4" />
                                                Canceled Successfully
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className={`flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 
                                                        ${isCanceling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:text-white hover:border-red-600'}`}
                                                    onClick={() => cancelRegistration(event._id)}
                                                    disabled={isCanceling}
                                                >
                                                    {isCanceling ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Canceling...
                                                        </span>
                                                    ) : (
                                                        'Cancel Registration'
                                                    )}
                                                </button>
                                                {isSuccessfullyRegistered && (
                                                    <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium cursor-default">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AttendeeDashboard;