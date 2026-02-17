import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const connectionString =
  process.env.BETTER_AUTH_DATABASE_URL ??
  (process.env.DB_HOST &&
  process.env.DB_USERNAME &&
  process.env.DB_PASSWORD &&
  process.env.DB_NAME
    ? `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT ?? 5433}/${process.env.DB_NAME}`
    : undefined);

export const authConfig = {
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:6006',
  secret: process.env.BETTER_AUTH_SECRET,
  database: connectionString
    ? new Pool({ connectionString })
    : undefined,
  user: {
    additionalFields: {
      username: {
        type: 'string' as const,
        required: false,
        input: true,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },
};

export const auth = betterAuth(authConfig);
