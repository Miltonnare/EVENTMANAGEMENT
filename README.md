# Event Management System

A full-stack event management application where organizers can create and manage events, and attendees can browse, register, and manage their registrations. Built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, JWT-protected profile)
- Role-based access (`attendee` / `organizer`)
- Event CRUD with image uploads (Cloudinary) and QR codes
- Event registration with capacity limits
- Organizer and attendee dashboards
- Rate limiting, input sanitization, and security headers

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, Axios, React Router |
| Backend  | Node.js, Express 5, MongoDB, Mongoose |
| Auth     | JWT, bcryptjs |
| Media    | Cloudinary, Multer |
| Testing  | Jest, Supertest (server) · Vitest, Testing Library (client) |

## Project Structure

```
Events/
├── client/                 # React frontend (Vite)
├── server/                 # Express API
│   ├── config/             # Environment, DB, Cloudinary, security
│   ├── controllers/        # HTTP request handlers
│   ├── middleware/         # Auth, logging, errors, asyncHandler
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── validators/         # express-validator rules
│   ├── utils/              # ApiError, JWT, response helpers
│   ├── tests/              # API integration tests
│   ├── app.js              # Express application setup
│   └── server.js           # Server entry point
├── Dockerfile
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for event image uploads)

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd Events

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/events
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_AUTH_URL=http://localhost:5000/api/auth
VITE_API_EVENTS_URL=http://localhost:5000/api/events
VITE_API_REGISTRATION_URL=http://localhost:5000/api/eventRegistration
```

### 3. Run the application

**Backend** (from `server/`):

```bash
npm run dev    # development with nodemon
npm start      # production
```

**Frontend** (from `client/`):

```bash
npm run dev
```

The API runs on `http://localhost:5000` and the client on `http://localhost:5173` by default.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | No | Health check |
| `POST` | `/api/auth/register` | No | Register a user |
| `POST` | `/api/auth/login` | No | Log in |
| `GET` | `/api/auth/profile` | Yes | Get current user |
| `GET` | `/api/events` | No | List all events |
| `GET` | `/api/events/:id` | No | Get event by ID |
| `GET` | `/api/events/mine/me` | Yes | Organizer's events |
| `GET` | `/api/events/registered/me` | Yes | Attendee's registered events |
| `GET` | `/api/events/:eventId/attendees` | Yes | Event attendees (organizer) |
| `POST` | `/api/events` | Yes | Create event |
| `PUT` | `/api/events/:id` | Yes | Update event |
| `DELETE` | `/api/events/:id` | Yes | Delete event |
| `POST` | `/api/eventRegistration/:eventId/register` | Yes | Register for event |
| `DELETE` | `/api/eventRegistration/:eventId/cancel` | Yes | Cancel registration |
| `GET` | `/api/eventRegistration/:eventId/attendees` | Yes | View attendees (organizer) |

Protected routes require `Authorization: Bearer <token>`.

## Backend Architecture

The API follows an MVC-style layout:

- **Routes** — define endpoints and wire middleware
- **Controllers** — handle HTTP requests and responses
- **Services** — contain business logic
- **Models** — Mongoose schemas and data access
- **Middleware** — auth, logging, centralized error handling, `asyncHandler`
- **Validators** — request validation via `express-validator`
- **Utils** — reusable helpers (`ApiError`, response formatters, JWT)

## Testing

```bash
# Server (from server/)
npm test

# Client (from client/)
npm test
```

Server tests use an in-memory MongoDB instance and do not require a running database.

## Docker

Build and run the combined app (serves the built client from the API):

```bash
docker build -t events-app .
docker run -p 5000:5000 --env-file server/.env events-app
```

## Scripts Reference

| Location | Command | Description |
|----------|---------|-------------|
| `server/` | `npm run dev` | Start API with nodemon |
| `server/` | `npm start` | Start API |
| `server/` | `npm test` | Run API tests |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build |
| `client/` | `npm test` | Run frontend tests |

## License

ISC
