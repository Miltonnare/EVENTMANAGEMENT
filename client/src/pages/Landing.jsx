import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeaturedEvents from '../components/FeaturedEvents';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSignup from '../components/NewsletterSignup';
import { Sparkles, Calendar, Ticket, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col gap-16 py-8">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-indigo-500/10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Next-Gen Event Management Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] animate-fade-in">
            Discover & Experience Extraordinary <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Events Worldwide</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed animate-fade-in">
            Seamless ticket booking, real-world digital QR access, dynamic pricing, and organizer tools built for modern event creation.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              Explore All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-slate-700 font-bold text-base transition flex items-center justify-center gap-2"
            >
              Host an Event
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8 pt-8 border-t border-slate-800/80">
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">50K+</div>
              <div className="text-xs text-slate-400 font-medium">Tickets Sold</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">1,200+</div>
              <div className="text-xs text-slate-400 font-medium">Active Events</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">99.9%</div>
              <div className="text-xs text-slate-400 font-medium">Scanner Uptime</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-pink-400">4.9/5</div>
              <div className="text-xs text-slate-400 font-medium">Attendee Rating</div>
            </div>
          </div>
        </section>

        {/* Featured Events Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <FeaturedEvents />
        </section>

        {/* Features Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <FeaturesSection />
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <TestimonialsSection />
        </section>

        {/* Newsletter / CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <NewsletterSignup />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-slate-200">EventSphere</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/events" className="hover:text-white transition">Browse Events</Link>
            <Link to="/login" className="hover:text-white transition">Sign In</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;