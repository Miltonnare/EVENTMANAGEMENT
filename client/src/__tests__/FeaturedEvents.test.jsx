import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import FeaturedEvents from '../components/FeaturedEvents';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../components/EventCard', () => ({
  default: ({ event }) => <div data-testid="event-card">{event.title}</div>,
}));

describe('FeaturedEvents', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('shows upcoming events only', async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    axios.get.mockResolvedValue({
      data: {
        events: [
          { _id: '1', title: 'Future Event', date: futureDate },
          { _id: '2', title: 'Past Event', date: pastDate },
        ],
      },
    });

    render(
      <MemoryRouter>
        <FeaturedEvents />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    });

    const cards = screen.getAllByTestId('event-card');
    expect(cards).toHaveLength(1);
    expect(screen.getByText('Future Event')).toBeInTheDocument();
  });
});
