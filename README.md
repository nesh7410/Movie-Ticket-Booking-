# Movie Booking Frontend

React frontend for the Movie Ticket Booking System.

## Installation

```bash
npm install
```

## Running the Application

Development mode:
```bash
npm start
```

The app will open at `http://localhost:3000`

Build for production:
```bash
npm run build
```

## Features

- User authentication (Login/Register)
- Browse movies
- View movie details
- View available screens
- Protected routes
- Responsive design

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.js
│   └── MovieCard.js
├── pages/            # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── Home.js
│   └── MovieDetails.js
├── services/         # API service layer
│   └── api.js
├── context/          # React context
│   └── AuthContext.js
├── App.js           # Main app component
└── index.js         # Entry point
```

## Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. This is set in:
- `package.json` (proxy setting)
- `src/services/api.js` (baseURL)

## Dependencies

- react - UI library
- react-router-dom - Routing
- axios - HTTP client

## Authentication

JWT tokens are stored in localStorage and automatically attached to API requests via axios interceptors.

