import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../../config';
import type { MoviesListResponse, MoviesListItem } from '../../types';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const url = getMoviesUrl(`/movies/tv/on-the-air?page=${page}`);
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to load on the air' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.json();
  const raw = data?.results ?? [];
  const results: MoviesListItem[] = raw.map((item: MoviesListItem) => ({
    ...item,
    media_type: 'tv' as const,
  }));
  const body: MoviesListResponse = { results };
  return Response.json(body);
}
