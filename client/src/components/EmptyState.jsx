import React from 'react';
import { CalendarX, SearchX, TicketX, Plus } from 'lucide-react';

const EmptyState = ({
  type = 'events',
  title,
  description,
  actionText,
  onAction,
}) => {
  const defaults = {
    events: {
      icon: CalendarX,
      title: 'No Events Found',
      description: 'We couldn’t find any events matching your criteria. Try adjusting your search filters or check back later!',
    },
    tickets: {
      icon: TicketX,
      title: 'No Digital Tickets Yet',
      description: 'You haven’t registered or purchased tickets for any upcoming events.',
      actionText: 'Explore Events',
    },
    search: {
      icon: SearchX,
      title: 'No Search Results',
      description: 'Try searching with a different term or keyword.',
    },
  };

  const current = defaults[type] || defaults.events;
  const Icon = current.icon;

  return (
    <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border border-slate-800 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title || current.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
        {description || current.description}
      </p>
      {(actionText || current.actionText || onAction) && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionText || current.actionText || 'Get Started'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
