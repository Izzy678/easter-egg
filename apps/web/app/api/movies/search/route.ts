import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../config';
import type { MoviesListResponse, MoviesListItem } from '../types';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') ?? '';
  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const url = getMoviesUrl(
    `/movies/search?query=${encodeURIComponent(query)}&page=${page}`
  );
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Search failed' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.json();
  const results = (data?.results ?? []).filter(
    (r: MoviesListItem) => r.media_type === 'movie' || r.media_type === 'tv'
  ) as MoviesListItem[];
  const body: MoviesListResponse = { results };
  return Response.json(body);
}
