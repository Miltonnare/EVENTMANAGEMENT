import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../components/OrganizerDashboard', () => ({
  default: () => <div>Organizer Dashboard</div>,
}));

vi.mock('../components/AttendeeDashboard', () => ({
  default: () => <div>Attendee Dashboard</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders organizer dashboard for organizer role', async () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ name: 'Organizer', role: 'organizer' }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { name: 'Organizer', role: 'organizer' } }),
    });

    render(
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Organizer Dashboard')).toBeInTheDocument();
    });
  });

  it('renders attendee dashboard for attendee role', async () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ name: 'Attendee', role: 'attendee' }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { name: 'Attendee', role: 'attendee' } }),
    });

    render(
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Attendee Dashboard')).toBeInTheDocument();
    });
  });
});
