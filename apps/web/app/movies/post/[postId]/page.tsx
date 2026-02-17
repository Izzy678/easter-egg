'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import {
  CommentThread,
  buildCommentTree,
  type ApiComment,
  type CommentTreeNode,
} from '@/components/movies/CommentThread';
import { ThumbsUpIcon, ThumbsDownIcon, MessageSquareIcon, ArrowLeftIcon, Share2Icon, ChevronDownIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const DEFAULT_AVATAR = '/static/images/people/1.webp';

interface PostUser {
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
  user?: PostUser | null;
  likeCount?: number;
  commentCount?: number;
}

export default function PostDetailPage() {
  const params = useParams();
  const postIdParam = params.postId as string;
  const postId = parseInt(postIdParam, 10);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [post, setPost] = useState<ApiPost | null>(null);
  const [flatComments, setFlatComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [likedPost, setLikedPost] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());
  const [newCommentContent, setNewCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fetchPost = useCallback(() => {
    if (Number.isNaN(postId) || postId < 1) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    fetch(`/api/posts/${postId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch post');
        return res.json() as Promise<ApiPost>;
      })
      .then((data) => {
        if (data) {
          setPost(data);
          // Load liked state so it persists after refresh
          fetch(
            `/api/likes/me?targetType=post&targetId=${encodeURIComponent(postId)}`
          )
            .then((r) => r.json())
            .then((payload: { liked?: boolean }) => {
              if (typeof payload.liked === 'boolean') setLikedPost(payload.liked);
            })
            .catch(() => {});
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [postId]);

  const fetchComments = useCallback(() => {
    if (Number.isNaN(postId) || postId < 1) return;
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => {
        if (!res.ok) return [];
        return res.json() as Promise<ApiComment[]>;
      })
      .then((data) => setFlatComments(Array.isArray(data) ? data : []))
      .catch(() => setFlatComments([]));
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post != null) fetchComments();
  }, [post, fetchComments]);

  const refetchAll = useCallback(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleLikePost = () => {
    fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType: 'post', targetId: postId }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          const returnUrl = encodeURIComponent(
            typeof window !== 'undefined' ? window.location.href : ''
          );
          window.location.href = `/api/auth/signin?callbackUrl=${returnUrl}`;
          return null;
        }
        if (!res.ok) return null;
        return res.json() as Promise<{ liked: boolean; count: number }>;
      })
      .then((data) => {
        if (!data || typeof data.liked !== 'boolean') return;
        setPost((prev) =>
          prev
            ? { ...prev, likeCount: data.count ?? prev.likeCount }
            : null
        );
        setLikedPost(data.liked);
      });
  };

  const handleLikeComment = (commentId: number) => {
    fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType: 'comment',
        targetId: commentId,
      }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          const returnUrl = encodeURIComponent(
            typeof window !== 'undefined' ? window.location.href : ''
          );
          window.location.href = `/api/auth/signin?callbackUrl=${returnUrl}`;
          return null;
        }
        if (!res.ok) return null;
        return res.json() as Promise<{ liked: boolean; count: number }>;
      })
      .then((data) => {
        if (!data || typeof data.liked !== 'boolean') return;
        setFlatComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likeCount: data.count ?? c.likeCount }
              : c
          )
        );
        setLikedCommentIds((prev) => {
          const next = new Set(prev);
          if (data.liked) next.add(commentId);
          else next.delete(commentId);
          return next;
        });
      });
  };

  const handleSubmitNewComment = () => {
    if (!newCommentContent.trim() || submittingComment) return;
    setSubmittingComment(true);
    fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newCommentContent.trim() }),
    })
      .then((res) => {
        if (res.status === 401) {
          const returnUrl = encodeURIComponent(
            typeof window !== 'undefined' ? window.location.href : ''
          );
          window.location.href = `/api/auth/signin?callbackUrl=${returnUrl}`;
          return;
        }
        if (!res.ok) throw new Error('Failed to post comment');
        setNewCommentContent('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        refetchAll();
      })
      .finally(() => setSubmittingComment(false));
  };

  const commentTree: CommentTreeNode[] = buildCommentTree(flatComments);
  const authorName =
    post?.user?.username?.trim() || post?.user?.name?.trim() || 'User';
  const authorUsername = post?.user?.username?.trim() || post?.user?.name?.trim() || 'user';
  const authorAvatar = post?.user?.image || DEFAULT_AVATAR;
  
  // Extract post title (first line) and content
  const contentLines = post?.content.split('\n').filter(Boolean) || [];
  const hasMultipleLines = contentLines.length > 1;
  const postTitle = hasMultipleLines ? contentLines[0] : (post?.itemName || 'Untitled Post');
  const postContent = hasMultipleLines ? contentLines.slice(1).join('\n') : post?.content || '';

  if (Number.isNaN(postId) || postId < 1) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Invalid post ID.</p>
      </div>
    );
  }

  if (loading && !post) {
    return (
      <div className="w-full h-screen overflow-hidden bg-background flex flex-col">
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 min-h-0 lg:ml-64 flex flex-col">
            <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex-1 min-h-0 overflow-y-auto pt-20 pb-12 flex items-center justify-center">
              <p className="text-muted-foreground">Loading…</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="w-full h-screen overflow-hidden bg-background flex flex-col">
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 min-h-0 lg:ml-64 flex flex-col">
            <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex-1 min-h-0 overflow-y-auto pt-20 pb-12 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Post not found.</p>
                <Link
                  href="/movies"
                  className="inline-flex items-center gap-2 text-primary-500 hover:underline"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to feed
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-background text-foreground flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 min-h-0 lg:ml-64 flex flex-col">
          <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumbs */}
              <nav className="mb-6 text-sm text-muted-foreground">
                <Link href="/movies" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/movies" className="hover:text-foreground transition-colors">
                  Reviews
                </Link>
                {post.itemName && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{post.itemName}</span>
                  </>
                )}
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Post + Comments */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Author Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-white/10 flex-shrink-0">
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">@{authorUsername}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Title */}
                  <h1 className="text-3xl font-bold text-foreground leading-tight">
                    {postTitle}
                  </h1>

                  {/* Movie poster banner */}
                  {post.itemImageUrl && (
                    <div className="relative w-full aspect-[2.5/1] max-h-[400px] rounded-xl overflow-hidden bg-muted border border-white/5">
                      <img
                        src={post.itemImageUrl}
                        alt={post.itemName ?? 'Movie'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  {postContent && (
                    <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                      {postContent}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interaction Bar */}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleLikePost}
                      className={cn(
                        'flex items-center gap-2 text-sm font-medium transition-colors',
                        likedPost
                          ? 'text-primary-500 hover:text-primary-400'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      aria-label={likedPost ? 'Unlike' : 'Like'}
                    >
                      <ThumbsUpIcon
                        className={cn('w-5 h-5', likedPost && 'fill-current')}
                      />
                      <span>{post.likeCount ?? 0}</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ThumbsDownIcon className="w-5 h-5" />
                    </button>
                    <Link
                      href={`#comments`}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageSquareIcon className="w-5 h-5" />
                      <span>{post.commentCount ?? 0}</span>
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Share2Icon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Discussion Section */}
                  <section id="comments" className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-foreground">
                        Discussion ({post.commentCount ?? 0})
                      </h2>
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Sort by: Top
                          <ChevronDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Comment Form */}
                    <div className="mb-6 flex gap-2 items-end">
                      <textarea
                        ref={textareaRef}
                        value={newCommentContent}
                        onChange={(e) => {
                          setNewCommentContent(e.target.value);
                          // Auto-resize
                          const el = e.target;
                          el.style.height = 'auto';
                          el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                        }}
                        placeholder="Add to the discussion…"
                        rows={1}
                        className="flex-1 min-h-[44px] max-h-32 px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary-500/50 resize-none overflow-y-auto"
                      />
                      <button
                        type="button"
                        onClick={handleSubmitNewComment}
                        disabled={!newCommentContent.trim() || submittingComment}
                        className="flex-shrink-0 px-4 py-2.5 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {submittingComment ? 'Posting…' : 'Post Comment'}
                      </button>
                    </div>

                    {/* Comment Thread */}
                    <CommentThread
                      comments={commentTree}
                      postId={postId}
                      onLikeComment={handleLikeComment}
                      onReplySuccess={refetchAll}
                      likedCommentIds={likedCommentIds}
                    />
                  </section>
                </div>

                {/* Right Column: Movie Sidebar */}
                <aside className="lg:col-span-1 hidden lg:block">
                  <div className="sticky top-8 space-y-6">
                    {/* Movie Poster */}
                    {post.itemImageUrl && (
                      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-muted border border-white/5">
                        <img
                          src={post.itemImageUrl}
                          alt={post.itemName ?? 'Movie'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Movie Info */}
                    {post.itemName && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {post.itemName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {post.itemType === 'movie' ? 'Movie' : 'Series'}
                          </p>
                        </div>

                        {/* Tags as genres */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs font-medium bg-white/5 text-muted-foreground rounded border border-white/10"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
