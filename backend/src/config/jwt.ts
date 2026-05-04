import dotenv from 'dotenv';

dotenv.config();

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!secret) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

if (!refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables.');
}

export const jwtConfig: JwtConfig = {
  secret,
  expiresIn,
  refreshSecret,
  refreshExpiresIn,
};
