import React from 'react';

const HeroSection = () => (
  <section className="relative w-full min-h-[60vh] flex items-center justify-center px-4 py-16 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500 via-blue-300 to-purple-200" />
    {/* Glassmorphism overlay */}
    <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-lg" />
    {/* Decorative blurred shapes */}
    <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
    <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

    {/* Content */}
    <div className="relative z-20 max-w-3xl mx-auto text-center py-12 px-6 rounded-3xl shadow-xl bg-white/60 backdrop-blur-md border border-white/30">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 tracking-tight mb-6 drop-shadow-lg font-sans">
        Discover, Create & Join Events
      </h1>
      <p className="text-lg md:text-xl text-blue-900/80 font-light leading-relaxed mb-8">
        EventSphere is your gateway to a world of creativity, connection, and opportunity. Explore trending events, register with ease, and experience the best in modern event management.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/events"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Browse Events
        </a>
        <a
          href="/register"
          className="px-8 py-3 rounded-xl bg-white/80 text-blue-700 font-semibold border border-blue-200 shadow hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Register Now
        </a>
      </div>
    </div>
  </section>
);

export default HeroSection;
