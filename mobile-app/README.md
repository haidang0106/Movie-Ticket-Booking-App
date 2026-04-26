# MBooking Mobile App

## Development Setup

### API Configuration
For local development, the API base URL is configured in `src/config/api.ts`.

#### Real phone / Expo Go
You must use your computer's LAN IP address.
Example: `http://192.168.0.101:3000/api`

#### Android Emulator
Use: `http://10.0.2.2:3000/api`

#### iOS Simulator
Use: `http://localhost:3000/api`

### Testing Connection
You can verify if your phone can reach the backend by opening this URL in your phone's browser:
`http://<YOUR_COMPUTER_IP>:3000/api/health`

## Scripts
- `npm run start`: Start Expo dev server
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS
- `npm run tsc`: Run type checking
