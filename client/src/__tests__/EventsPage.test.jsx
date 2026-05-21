import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Events from '../pages/Events';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../components/EventCard', () => ({
  default: ({ event }) => <div data-testid="event-card">{event.title}</div>,
}));

describe('Events page', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('filters events by search term and date', async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    axios.get.mockResolvedValue({
      data: {
        events: [
          { _id: '1', title: 'Future Concert', description: 'Music', date: futureDate },
          { _id: '2', title: 'Past Workshop', description: 'Workshop', date: pastDate },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Discover Amazing Events')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('event-card')).toHaveLength(2);

    const searchInput = screen.getByPlaceholderText('Search events...');
    await userEvent.type(searchInput, 'Future');

    expect(screen.getAllByTestId('event-card')).toHaveLength(1);
    expect(screen.getByText('Future Concert')).toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'past');

    expect(screen.queryByText('Future Concert')).not.toBeInTheDocument();
    expect(screen.getByText('Past Workshop')).toBeInTheDocument();
  });
});
