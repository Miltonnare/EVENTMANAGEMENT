import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SharingTools from '../components/SharingTools';

describe('SharingTools', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      configurable: true,
    });
  });

  it('opens WhatsApp share link', async () => {
    render(<SharingTools eventTitle="Test Event" eventUrl="https://example.com/event" />);

    await userEvent.click(screen.getByText('WhatsApp'));

    expect(window.open).toHaveBeenCalled();
  });

  it('falls back to clipboard when native share is unavailable', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SharingTools eventTitle="Test Event" eventUrl="https://example.com/event" />);

    await userEvent.click(screen.getByText('Share'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Check out this amazing event: Test Event - https://example.com/event'
    );
    expect(window.alert).toHaveBeenCalledWith('Link copied to clipboard!');
  });
});
