import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.toString();
  const nestUrl = query ? getMoviesUrl(`/posts?${query}`) : getMoviesUrl('/posts');
  const res = await fetch(nestUrl);
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}

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

  let body: { content: string; itemType: string; itemId: number; tags?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { content, itemType, itemId, tags } = body;
  if (
    typeof content !== 'string' ||
    !content.trim() ||
    typeof itemType !== 'string' ||
    (itemType !== 'movie' && itemType !== 'series') ||
    typeof itemId !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid content, itemType (movie|series), or itemId' },
      { status: 400 }
    );
  }

  const tagsArray = Array.isArray(tags)
    ? tags.slice(0, 3).map((t) => String(t).trim()).filter(Boolean)
    : [];

  const nestUrl = getMoviesUrl('/posts');
  const res = await fetch(nestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,
      content: content.trim(),
      itemType,
      itemId,
      tags: tagsArray,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || 'Failed to create post' },
      { status: res.status }
    );
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: 201 });
}
