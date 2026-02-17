import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const nestUrl = getMoviesUrl(`/posts/${postId}/comments`);
  const { searchParams } = request.nextUrl;
  const query = searchParams.toString();
  const url = query ? `${nestUrl}?${query}` : nestUrl;
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const { postId } = await params;
  let body: { content: string; parentId?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { content, parentId } = body;
  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json(
      { error: 'Missing or invalid content' },
      { status: 400 }
    );
  }

  const nestUrl = getMoviesUrl(`/posts/${postId}/comments`);
  const res = await fetch(nestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,
      content: content.trim(),
      parentId: parentId ?? null,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || 'Failed to create comment' },
      { status: res.status }
    );
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: 201 });
}
