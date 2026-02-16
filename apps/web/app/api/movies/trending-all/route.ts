import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../config';
import type { MoviesListResponse, MoviesListItem } from '../types';

export async function GET(request: NextRequest) {
  const window = request.nextUrl.searchParams.get('window') ?? 'week';
  const url = getMoviesUrl(`/movies/trending-all?window=${window}`);
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to load trending' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.json();
  const results = (data?.results ?? []) as MoviesListItem[];
  const body: MoviesListResponse = { results };
  return Response.json(body);
}
