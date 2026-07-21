import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AttendeeDashboard from '../components/AttendeeDashboard';
import OrganizerDashboard from '../components/OrganizerDashboard';
import SkeletonLoader from '../components/SkeletonLoader';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
          <SkeletonLoader count={3} type="card" />
        </main>
      </div>
    );
  }

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {user?.name || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isOrganizer ? 'Organizer Portal & Management Hub' : 'Attendee Ticket Wallet & Registered Events'}
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit">
            Role: {user?.role || 'Attendee'}
          </span>
        </div>

        {isOrganizer ? (
          <OrganizerDashboard user={user} />
        ) : (
          <AttendeeDashboard user={user} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
