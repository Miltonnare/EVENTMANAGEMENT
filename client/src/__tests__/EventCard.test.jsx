import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import EventCard from '../components/EventCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EventCard', () => {
  const event = {
    _id: 'event-1',
    title: 'Tech Summit',
    description: 'A great tech event',
    date: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    image: null,
    qrCode: 'data:image/png;base64,QR',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders event details and toggles sharing tools', async () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech Summit')).toBeInTheDocument();
    expect(screen.getByText('A great tech event')).toBeInTheDocument();

    expect(screen.queryByText('Share This Event')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTitle('Share event'));

    expect(screen.getByText('Share This Event')).toBeInTheDocument();
  });

  it('navigates to details when register button is clicked', async () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText('Register'));

    expect(mockNavigate).toHaveBeenCalledWith('/events/event-1');
  });
});
