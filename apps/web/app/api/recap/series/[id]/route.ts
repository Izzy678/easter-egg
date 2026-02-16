import { NextRequest } from 'next/server';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const seriesId = parseInt(id, 10);
  if (Number.isNaN(seriesId)) {
    return new Response(JSON.stringify({ error: 'Invalid series id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season');
  const episodeFromParam = searchParams.get('episodeFrom');
  const episodeToParam = searchParams.get('episodeTo');
  const seasonNum = season != null ? parseInt(season, 10) : NaN;
  const episodeFrom = episodeFromParam != null ? parseInt(episodeFromParam, 10) : NaN;
  const episodeTo = episodeToParam != null ? parseInt(episodeToParam, 10) : NaN;
  if (
    Number.isNaN(seasonNum) ||
    Number.isNaN(episodeFrom) ||
    Number.isNaN(episodeTo) ||
    seasonNum < 1 ||
    episodeFrom < 1 ||
    episodeTo < 1
  ) {
    return new Response(
      JSON.stringify({
        error:
          'Query params season, episodeFrom, and episodeTo are required and must be at least 1',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (episodeFrom > episodeTo) {
    return new Response(
      JSON.stringify({ error: 'episodeFrom must be less than or equal to episodeTo' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const useEnriched = searchParams.get('useEnrichedContext') === 'true';
  const query = new URLSearchParams({
    season: String(seasonNum),
    episodeFrom: String(episodeFrom),
    episodeTo: String(episodeTo),
  });
  if (useEnriched) query.set('useEnrichedContext', 'true');
  const url = getMoviesUrl(`/recap/series/${seriesId}?${query.toString()}`);
  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    const text = await res.text();
    return new Response(
      text || JSON.stringify({ error: 'Failed to generate recap' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
