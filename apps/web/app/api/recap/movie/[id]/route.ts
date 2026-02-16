import { NextRequest } from 'next/server';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (Number.isNaN(movieId)) {
    return new Response(JSON.stringify({ error: 'Invalid movie id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body: { recapType?: string; includeEnding?: boolean; useEnrichedContext?: boolean } = {};
  try {
    const raw = await request.json();
    if (raw && typeof raw === 'object') {
      if (raw.recapType === 'quick' || raw.recapType === 'full') body.recapType = raw.recapType;
      if (typeof raw.includeEnding === 'boolean') body.includeEnding = raw.includeEnding;
      if (raw.useEnrichedContext === true) body.useEnrichedContext = true;
    }
  } catch {
    // optional body; leave body empty
  }

  const url = getMoviesUrl(`/recap/movie/${movieId}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

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
