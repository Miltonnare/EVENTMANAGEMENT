import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturedEvents from '../components/FeaturedEvents';
import NewsletterSignup from '../components/NewsletterSignup';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
            {/* Background Animation Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/4 -right-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            {/* Navigation */}
            <div className="relative z-20">
                <Navbar />
            </div>
            
            <main className="flex-grow relative z-10">
                {/* Hero Section with enhanced background */}
                <div className="relative">
                    <HeroSection />
                </div>

                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent mx-auto max-w-4xl"></div>

                {/* Featured Events Section */}
                <div className="relative">
                    <FeaturedEvents />
                </div>
                
                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent mx-auto max-w-4xl"></div>
                
                {/* Features Section with enhanced spacing */}
                <div className="relative py-8">
                    <FeaturesSection />
                </div>
                
                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent mx-auto max-w-4xl"></div>
                
                {/* Testimonials Section */}
                <div className="relative py-8">
                    <TestimonialsSection />
                </div>
                
                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent mx-auto max-w-4xl"></div>
                
                {/* Newsletter Signup Section */}
                <div className="relative py-8">
                    <NewsletterSignup />
                </div>
            </main>

            {/* Enhanced Footer with Modern Design */}
            <footer className="relative z-10 w-full bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white py-20 px-6 overflow-hidden">
                {/* Dynamic Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/95 via-purple-900/98 to-indigo-900/95"></div>
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
                
                {/* Floating Gradient Orbs */}
                <div className="absolute bottom-20 left-20 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 right-1/3 w-40 h-40 bg-indigo-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {/* Company Info with Enhanced Glassmorphism */}
                        <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.2)] transition-all duration-700 transform hover:-translate-y-2 hover:scale-105">
                            <div className="mb-6">
                                <h3 className="text-3xl font-black bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent mb-4 group-hover:from-violet-200 group-hover:to-white transition-all duration-500">
                                    EventSphere
                                </h3>
                                <div className="w-12 h-1 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full group-hover:w-16 transition-all duration-500"></div>
                            </div>
                            <p className="text-violet-100 mb-8 leading-relaxed font-medium text-lg">
                                The ultimate platform for discovering, creating, and managing amazing events that bring people together.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    // Twitter
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
                                    // Facebook
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                                    // Instagram
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                ].map((icon, index) => (
                                    <a 
                                        key={index}
                                        href="#" 
                                        className="group/social bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-violet-200 hover:text-white hover:bg-white/20 hover:border-white/50 transition-all duration-400 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110"
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="group bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-[0_20px_50px_rgba(255,255,255,0.08)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.15)] transition-all duration-700 transform hover:-translate-y-2">
                            <h4 className="text-xl font-black mb-8 text-white group-hover:text-violet-200 transition-colors duration-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-violet-400 rounded-full group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                                Platform
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { text: 'Browse Events', href: '/events' },
                                    { text: 'Create Event', href: '/register' },
                                    { text: 'Dashboard', href: '/dashboard' },
                                    { text: 'Analytics', href: '#' }
                                ].map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.href} 
                                            className="text-violet-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group/link font-medium text-lg"
                                        >
                                            <div className="w-1 h-1 bg-violet-400 rounded-full group-hover/link:w-2 transition-all duration-300"></div>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Support Links */}
                        <div className="group bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-[0_20px_50px_rgba(255,255,255,0.08)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.15)] transition-all duration-700 transform hover:-translate-y-2">
                            <h4 className="text-xl font-black mb-8 text-white group-hover:text-purple-200 transition-colors duration-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                                Support
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    'Help Center',
                                    'Contact Us',
                                    'Privacy Policy',
                                    'Terms of Service'
                                ].map((text, index) => (
                                    <li key={index}>
                                        <a 
                                            href="#" 
                                            className="text-violet-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group/link font-medium text-lg"
                                        >
                                            <div className="w-1 h-1 bg-purple-400 rounded-full group-hover/link:w-2 transition-all duration-300"></div>
                                            {text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Company Links */}
                        <div className="group bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-[0_20px_50px_rgba(255,255,255,0.08)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.15)] transition-all duration-700 transform hover:-translate-y-2">
                            <h4 className="text-xl font-black mb-8 text-white group-hover:text-indigo-200 transition-colors duration-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                                Company
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    'About Us',
                                    'Careers',
                                    'Blog',
                                    'Press'
                                ].map((text, index) => (
                                    <li key={index}>
                                        <a 
                                            href="#" 
                                            className="text-violet-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group/link font-medium text-lg"
                                        >
                                            <div className="w-1 h-1 bg-indigo-400 rounded-full group-hover/link:w-2 transition-all duration-300"></div>
                                            {text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Enhanced Copyright Section */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.15)] transition-all duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-violet-100 font-medium text-lg">
                                &copy; {new Date().getFullYear()} EventSphere. All Rights Reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-px bg-gradient-to-r from-violet-400 to-purple-500"></div>
                                <span className="text-violet-300 font-medium">Miltonnare</span>
                                <div className="w-8 h-px bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;