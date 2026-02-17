'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import { DiscussionCard } from '@/components/movies/DiscussionCard';
import { DiscussionCardSkeleton } from '@/components/movies/DiscussionCardSkeleton';
import { TrendingSideRail } from '@/components/movies/TrendingSideRail';
import { formatDistanceToNow } from 'date-fns';

interface ApiPostUser {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface ApiPost {
  id: number;
  userId: string | null;
  content: string;
  itemType: string;
  itemId: number;
  itemName: string | null;
  itemImageUrl: string | null;
  tags: string[];
  createdAt: string;
  user?: ApiPostUser | null;
  likeCount?: number;
  commentCount?: number;
}

/** Response from GET /api/posts: either { posts, page, limit, total, totalPages } or a plain array (legacy). */
type PostsResponse = { posts?: ApiPost[]; page?: number; limit?: number; total?: number; totalPages?: number } | ApiPost[];

const DEFAULT_AVATAR = '/static/images/people/1.webp';

function mapPostToCard(
  post: ApiPost,
  opts: { liked?: boolean; onLike?: () => void }
) {
  const firstLine = post.content.split(/\n/)[0]?.trim() || post.content;
  const topicTitle = firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine;
  const previewText = post.content.length > 200 ? `${post.content.slice(0, 197)}...` : post.content;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const authorName = post.user?.username?.trim() || post.user?.name?.trim() || 'User';
  const authorAvatar = post.user?.image || DEFAULT_AVATAR;

  return {
    movieTitle: post.itemName ?? 'Movie',
    topicTitle,
    previewText,
    author: { name: authorName, avatar: authorAvatar },
    tags: Array.isArray(post.tags) ? post.tags : [],
    stats: {
      comments: post.commentCount ?? 0,
      likes: post.likeCount ?? 0,
      timeAgo,
    },
    poster: post.itemImageUrl ?? undefined,
    postId: post.id,
    liked: opts.liked,
    onLike: opts.onLike,
  };
}

export default function MoviesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [posts, setPosts] = useState<ApiPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedPostIds, setLikedPostIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data: PostsResponse) => {
                const list = Array.isArray(data) ? data : data?.posts ?? [];
                setPosts(list);
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, []);

    const handleLike = (postId: number) => {
        fetch('/api/likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetType: 'post', targetId: postId }),
        })
            .then(async (res) => {
                if (res.status === 401) {
                    const returnUrl = encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.pathname : '/movies'
                    );
                    window.location.href = `/api/auth/signin?callbackUrl=${returnUrl}`;
                    return null;
                }
                if (!res.ok) return null;
                const data = (await res.json()) as { liked?: boolean; count?: number };
                return data;
            })
            .then((data) => {
                if (!data || typeof data.liked !== 'boolean') return;
                const count = data.count;
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId ? { ...p, likeCount: count ?? p.likeCount } : p
                    )
                );
                setLikedPostIds((prev) => {
                    const next = new Set(prev);
                    if (data.liked) next.add(postId);
                    else next.delete(postId);
                    return next;
                });
            });
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-background text-foreground flex flex-col">
            {/* Layout Container - h-full so it doesn't exceed viewport */}
            <div className="flex flex-1 min-h-0">
                {/* Sidebar - fixed to viewport */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content - ml-64 offsets fixed sidebar; min-h-0 lets this shrink so inner div can scroll */}
                <main className="flex-1 min-w-0 min-h-0 lg:ml-64 flex flex-col">
                    {/* Header - fixed to viewport */}
                    <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />

                    {/* Only this div scrolls - sidebar and rail stay put */}
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-20 pb-12">
                        {/* Content Grid */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Discussion Feed */}
                                <div className="lg:col-span-2 space-y-6 min-w-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-foreground">Feeds</h2>
                                        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                                            <button className="px-3 py-1.5 text-xs font-medium text-foreground bg-white/10 rounded-md shadow-sm">Hot</button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">New</button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">Top</button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="space-y-6">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <DiscussionCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : posts.length === 0 ? (
                                        <p className="text-muted-foreground">No posts yet. Create one to get started.</p>
                                    ) : (
                                        posts.map((post) => (
                                            <DiscussionCard
                                                key={post.id}
                                                {...mapPostToCard(post, {
                                                    liked: likedPostIds.has(post.id),
                                                    onLike: () => handleLike(post.id),
                                                })}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* Right Column: Trending Side Rail */}
                                <div className="lg:col-span-1 hidden lg:block">
                                    <TrendingSideRail />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
