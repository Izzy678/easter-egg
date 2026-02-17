import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { searchParams } = request.nextUrl;
  const targetType = searchParams.get('targetType');
  const targetId = searchParams.get('targetId');
  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: 'Missing targetType or targetId' },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ liked: false });
  }

  const nestUrl = getMoviesUrl(
    `/likes/me?userId=${encodeURIComponent(session.user.id)}&targetType=${targetType}&targetId=${targetId}`
  );
  const res = await fetch(nestUrl);
  if (!res.ok) {
    return NextResponse.json({ liked: false });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
