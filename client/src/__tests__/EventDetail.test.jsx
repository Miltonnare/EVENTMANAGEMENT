import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import EventDetail from '../pages/EventDetail';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('EventDetail page', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders event details successfully', async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    axios.get.mockResolvedValueOnce({
      data: {
        event: {
          _id: 'event-1',
          title: 'Developer Meetup',
          description: 'Event description',
          date: futureDate,
          location: 'Online',
          ticketTypes: [{ _id: 'tt1', name: 'Free Pass', category: 'free', price: 0, available: 50 }],
        },
      },
    });

    render(
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={['/events/event-1']}>
            <Routes>
              <Route path="/events/:id" element={<EventDetail />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Developer Meetup')).toBeInTheDocument();
    });
  });

  it('shows error state when event cannot be loaded', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={['/events/event-1']}>
            <Routes>
              <Route path="/events/:id" element={<EventDetail />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument();
    });
  });
});
