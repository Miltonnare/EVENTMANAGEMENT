import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-6 relative overflow-hidden">
      {/* Neuromorphic background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/95 to-gray-900/90"></div>
      
      {/* Glassmorphic floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Main content container with glassmorphic effect */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Hero title with enhanced typography */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
            Discover Amazing
            <span className="block text-4xl md:text-6xl font-bold text-gray-300 mt-2">Events Near You</span>
          </h1>
        </div>
        
        {/* Enhanced subtitle with glassmorphic container */}
        <div className="mb-12">
          <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Join thousands of people discovering, attending, and creating unforgettable events. 
              From concerts to workshops, find your next adventure with EventSphere.
            </p>
          </div>
        </div>
        
        {/* Enhanced CTA buttons with neuromorphic effects */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            to="/events" 
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 backdrop-blur-md border border-blue-500/20"
          >
            <span className="relative z-10">Browse Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
          </Link>
          
          <Link 
            to="/register" 
            className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-500 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transform hover:-translate-y-1"
          >
            <span className="relative z-10">Create Account</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
          </Link>
        </div>
        
        {/* Enhanced stats section with glassmorphic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">10K+</div>
            <div className="text-gray-300 font-medium">Events Created</div>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">5K+</div>
            <div className="text-gray-300 font-medium">Happy Attendees</div>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">10+</div>
            <div className="text-gray-300 font-medium">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
