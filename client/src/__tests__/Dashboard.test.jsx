import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Dashboard from '../pages/Dashboard';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../components/OrganizerDashboard', () => ({
  default: () => <div>Organizer Dashboard</div>,
}));

vi.mock('../components/AttendeeDashboard', () => ({
  default: () => <div>Attendee Dashboard</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    axios.get.mockReset();
    localStorage.clear();
  });

  it('renders organizer dashboard for organizer role', async () => {
    localStorage.setItem('token', 'token');
    axios.get.mockResolvedValueOnce({
      data: { name: 'Organizer', role: 'organizer' },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Organizer Dashboard')).toBeInTheDocument();
    });
  });

  it('renders attendee dashboard for attendee role', async () => {
    localStorage.setItem('token', 'token');
    axios.get.mockResolvedValueOnce({
      data: { name: 'Attendee', role: 'attendee' },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Attendee Dashboard')).toBeInTheDocument();
    });
  });
});
