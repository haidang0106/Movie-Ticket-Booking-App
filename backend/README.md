# Movie Ticket Booking API (Backend)

This is the backend service for the Movie Ticket Booking App, built using Node.js, Express, TypeScript, and SQL Server.

## Prerequisites

- **Node.js**: v18+ recommended
- **SQL Server**: Running locally or remotely
- **Redis**: Required for OTP caching and JWT blacklisting

## Environment Configuration

1. Copy the example `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your SQL Server credentials, JWT secrets, Redis URL, and SMTP details.
   - *Note on SMTP*: If SMTP is not configured in development mode, the OTP will be securely logged in your local console for testing.

## Getting Started

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Smoke Testing Auth Flow

A developer-friendly smoke test script is available to quickly verify the Authentication flow (Register -> Verify OTP -> Login -> Profile -> Refresh -> Logout -> Blacklist check) before starting frontend/mobile integration.

Run the test:
```bash
npm run test:auth
```

*Note*: The automated script handles registering a temporary user, authenticating, refreshing tokens, and validating the JWT blacklist mechanism. When prompted by the script, simply copy the OTP printed in your backend server logs (if using dev mode without SMTP) and paste it into the prompt.

## API Documentation

Check out the explicit API documentation for the Auth module here: [docs/api/auth-api.md](../../docs/api/auth-api.md)
