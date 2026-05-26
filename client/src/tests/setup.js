import '@testing-library/jest-dom';

process.env.VITE_API_EVENTS_URL = 'http://localhost/api/events';
process.env.VITE_API_AUTH_URL = 'http://localhost/api/auth';
process.env.VITE_API_REGISTRATION_URL = 'http://localhost/api/eventRegistration';
process.env.VITE_API_URL = 'http://localhost';
process.env.VITE_API_TICKETS_URL = 'http://localhost/api/tickets';

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
