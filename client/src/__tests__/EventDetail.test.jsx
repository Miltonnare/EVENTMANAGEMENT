import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import EventDetail from '../pages/EventDetail';

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
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders event details and registers the user', async () => {
    localStorage.setItem('token', 'token');
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    axios.get.mockResolvedValueOnce({
      data: {
        event: {
          _id: 'event-1',
          title: 'Developer Meetup',
          description: 'Event description',
          date: futureDate,
          location: 'Online',
        },
      },
    });

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter initialEntries={['/events/event-1']}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Developer Meetup')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Register for Event'));

    expect(axios.post).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Registered successfully');
  });

  it('shows error state when event cannot be loaded', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/events/event-1']}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument();
    });
  });
});
