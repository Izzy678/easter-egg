import { NextRequest, NextResponse } from 'next/server';
import { getMoviesUrl } from '@/app/api/movies/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const id = parseInt(postId, 10);
  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json(
      { error: 'Invalid post ID' },
      { status: 400 }
    );
  }

  const nestUrl = getMoviesUrl(`/posts/${id}`);
  const res = await fetch(nestUrl);
  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
