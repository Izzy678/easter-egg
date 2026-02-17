import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth';
import { getMigrations } from 'better-auth/db';

/**
 * One-time setup: run this once to create Better Auth tables (user, session, account, verification).
 * Call: POST /api/auth/migrate
 * Safe to call multiple times (only creates missing tables/columns).
 * Restrict to development or remove after first run.
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Migrations are disabled in production' },
      { status: 403 }
    );
  }

  if (!authConfig.database) {
    return NextResponse.json(
      { error: 'No database configured. Set BETTER_AUTH_DATABASE_URL or DB_* env vars.' },
      { status: 400 }
    );
  }

  try {
    const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(authConfig);

    if (toBeCreated.length === 0 && toBeAdded.length === 0) {
      return NextResponse.json({
        message: 'No migrations needed.',
        toBeCreated: [],
        toBeAdded: [],
      });
    }

    await runMigrations();

    return NextResponse.json({
      message: 'Migrations completed successfully.',
      toBeCreated: toBeCreated.map((t) => t.table),
      toBeAdded: toBeAdded.map((t) => t.table),
    });
  } catch (error) {
    console.error('[Better Auth] Migrate error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Migration failed',
      },
      { status: 500 }
    );
  }
}
