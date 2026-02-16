/**
 * Server-side config for proxying to the movies backend.
 * Use this in route handlers only; do not use in client components.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  'http://localhost:3000/api';

export function getMoviesApiBase(): string {
  return API_BASE;
}

export function getMoviesUrl(path: string): string {
  const base = getMoviesApiBase().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
