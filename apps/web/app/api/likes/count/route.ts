import { NextRequest, NextResponse } from 'next/server';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const targetType = searchParams.get('targetType');
  const targetId = searchParams.get('targetId');
  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: 'Missing targetType or targetId' },
      { status: 400 }
    );
  }
  const nestUrl = getMoviesUrl(`/likes/count?targetType=${targetType}&targetId=${targetId}`);
  const res = await fetch(nestUrl);
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to get like count' },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
