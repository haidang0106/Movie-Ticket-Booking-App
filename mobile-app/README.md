# MBooking Mobile App

## Development Setup

### Dynamic API Configuration
For local development, the API base URL is resolved dynamically in `src/config/api.ts`. 

Supported modes:

#### 1. Real phone / Expo Go
- Usually resolved automatically using the Metro host IP from `Constants.expoConfig?.hostUri`.
- Ensure your backend is running on the same computer and port 3000.
- Ensure your phone and laptop are connected to the same Wi-Fi network.
- Test connection from your phone browser: `http://<YOUR_COMPUTER_IP>:3000/api/health`

#### 2. Android Emulator
- Automatically resolved via fallback to `http://10.0.2.2:3000/api`.

#### 3. Manual Override via Environment Variables
- If you need to manually specify a URL, you can define `EXPO_PUBLIC_API_URL` in your environment or a local `.env` file (do not commit `.env`).
- Example:
  `EXPO_PUBLIC_API_URL=http://192.168.0.101:3000/api`
- Restart Expo with: `npx expo start -c`

## Scripts
- `npm run start`: Start Expo dev server
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS
- `npm run tsc`: Run type checking
