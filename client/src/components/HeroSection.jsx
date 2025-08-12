import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Amazing Events
          <span className="block text-blue-200">Near You</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Join thousands of people discovering, attending, and creating unforgettable events. 
          From concerts to workshops, find your next adventure with EventSphere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/events" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition duration-300 shadow-lg"
          >
            Browse Events
          </Link>
          <Link 
            to="/register" 
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Create Account
          </Link>
        </div>
        <div className="mt-12 flex justify-center items-center space-x-8 text-blue-100">
          <div className="text-center">
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm">Events Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-sm">Happy Attendees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">100+</div>
            <div className="text-sm">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
