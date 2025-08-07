import { useEffect, useState } from "react";
import axios from 'axios';

import Navbar from '../components/Navbar';

const LandingPage = () => {
    const [eventCount, setEventCount] = useState(0);
     const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEventCount = async () => {
            try {
                const res = await axios.get('/api/events');
                setEventCount(res.data.events ? res.data.events.length : 0);
                setEvents(res.data.events || []); 
            } catch (error) {
                console.error('Error Fetching Events:', error);
            }
        };
        fetchEventCount();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center text-center px-4 py-6">
                <h1 className="text-4xl md:text-6xl font-bold">EventSphere</h1>
                <p>Seamlessly manage and Register for amazing Events</p>

                <div className="flex gap-4 mb-8">
                    <a href="#events" className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition">
                        Browse Events
                    </a>
                    <a href="/register" className="border border-blue-600 text-blue-600 px-6 py-2">
                        Register Now
                    </a>
                </div>
                <div className="text-xl font-medium text-gray-800">
                    Total Events: <span className="text-blue-600 font-bold">{eventCount}</span>
                </div>

                <section id="events" className="bg-gray-50 px-6 py-10">
                <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>

                {events.length === 0 ? (
                    <p className="text-center text-gray-500">No events have been uploaded yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                <p className="text-gray-700">{event.description}</p>
                                <p className="text-sm mt-2 text-gray-500">Date: {new Date(event.date).toDateString()}</p>
                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Register
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            </main>

           
            <footer className="bg-gray-100 py-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} EventSphere. All Rights Reserved
            </footer>
        </div>
    );
};

export default LandingPage;