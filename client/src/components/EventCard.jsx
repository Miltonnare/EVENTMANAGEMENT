import React from 'react';

const EventCard = ({ event }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
    <p className="text-gray-700">{event.description}</p>
    <p className="text-sm mt-2 text-gray-500">
      Date: {new Date(event.date).toDateString()}
    </p>
    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Register
    </button>
  </div>
);

export default EventCard;