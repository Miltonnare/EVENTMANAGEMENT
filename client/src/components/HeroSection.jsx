import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20 px-6 relative overflow-hidden">
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Amazing Events
          <span className="block text-gray-300">Near You</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Join thousands of people discovering, attending, and creating unforgettable events. 
          From concerts to workshops, find your next adventure with EventSphere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/events" 
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition duration-300 shadow-lg"
          >
            Browse Events
          </Link>
          <Link 
            to="/register" 
            className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition duration-300 backdrop-blur-sm"
          >
            Create Account
          </Link>
        </div>
        <div className="mt-12 flex justify-center items-center space-x-8 text-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm">Events Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">5K+</div>
            <div className="text-sm">Happy Attendees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10+</div>
            <div className="text-sm">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
