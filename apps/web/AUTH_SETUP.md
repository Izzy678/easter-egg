# Better Auth setup (Google sign-in)

1. **Environment variables** (see `.env.example`):
   - `BETTER_AUTH_SECRET` – min 32 characters (e.g. `openssl rand -base64 32`)
   - `BETTER_AUTH_URL` – base URL of this app (e.g. `http://localhost:6006`)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` – from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (OAuth 2.0 Client ID, Web application). Add redirect URI: `http://localhost:6006/api/auth/callback/google` (or your production URL).
   - Optional: `BETTER_AUTH_DATABASE_URL` – PostgreSQL connection string for Better Auth tables. If unset, the app uses `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` when set.

2. **Database tables** (required for Google sign-in and sessions):
   With the Next.js dev server running and the same DB in `.env`, run **once**:
   ```bash
   curl -X POST http://localhost:6006/api/auth/migrate
   ```
   Or open in browser a tool that sends `POST` to `http://localhost:6006/api/auth/migrate`. This creates the `user`, `session`, `account`, and `verification` tables (and adds new columns like `username` when the config is extended). Safe to run again when new user fields are added.
   Alternatively, from `apps/web`: `npx @better-auth/cli@latest migrate --yes` (ensure `.env` is loaded, e.g. run from the same shell as `npm run dev`).

3. **Sign-in page**: `/sign-in`. Optional query: `callbackUrl` (e.g. `/sign-in?callbackUrl=/post/create`). Default callback is `/onboarding` for new users to set username and avatar.

4. **Onboarding**: New users (or users without a username) are redirected to `/onboarding` to choose a username and avatar before using the app. Existing users with a username skip onboarding.
