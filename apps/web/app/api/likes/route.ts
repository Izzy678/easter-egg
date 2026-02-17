import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMoviesUrl } from '@/app/api/movies/config';

const VALID_TARGET_TYPES = ['post', 'comment'];

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  let body: { targetType: string; targetId: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (
    !VALID_TARGET_TYPES.includes(targetType) ||
    typeof targetId !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid targetType (post|comment) or targetId' },
      { status: 400 }
    );
  }

  const nestUrl = getMoviesUrl('/likes');
  const res = await fetch(nestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,
      targetType,
      targetId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || 'Failed to toggle like' },
      { status: res.status }
    );
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data);
}
