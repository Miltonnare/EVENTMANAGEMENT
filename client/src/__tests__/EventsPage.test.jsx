import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Events from '../pages/Events';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../components/EventCard', () => ({
  default: ({ event }) => <div data-testid="event-card">{event.title}</div>,
}));

describe('Events page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders events list and header', async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        events: [{ _id: '1', title: 'Future Concert', description: 'Music', date: futureDate }],
        meta: { total: 1, page: 1, totalPages: 1 },
      }),
    });

    render(
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Events />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Explore Events & Experience Tech')).toBeInTheDocument();
      expect(screen.getByText('Future Concert')).toBeInTheDocument();
    });
  });
});
