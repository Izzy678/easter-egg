'use client';

import { useState } from 'react';
import { ThumbsUpIcon, MessageCircleIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const DEFAULT_AVATAR = '/static/images/people/1.webp';

export interface CommentUser {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

export interface ApiComment {
  id: number;
  postId: number;
  userId: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  user?: CommentUser | null;
  likeCount: number;
}

export interface CommentTreeNode extends ApiComment {
  children: CommentTreeNode[];
}

interface CommentBlockProps {
  comment: CommentTreeNode;
  depth: number;
  postId: number;
  onLikeComment: (commentId: number) => void;
  onReplySuccess: () => void;
  likedCommentIds: Set<number>;
}

function CommentBlock({
  comment,
  depth,
  postId,
  onLikeComment,
  onReplySuccess,
  likedCommentIds,
}: CommentBlockProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authorName =
    comment.user?.username?.trim() || comment.user?.name?.trim() || 'User';
  const authorUsername = comment.user?.username?.trim() || comment.user?.name?.trim() || 'user';
  const authorAvatar = comment.user?.image || DEFAULT_AVATAR;
  const liked = likedCommentIds.has(comment.id);

  const handleSubmitReply = () => {
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: replyContent.trim(), parentId: comment.id }),
    })
      .then((res) => {
        if (res.status === 401) {
          const returnUrl = encodeURIComponent(
            typeof window !== 'undefined' ? window.location.href : ''
          );
          window.location.href = `/api/auth/signin?callbackUrl=${returnUrl}`;
          return;
        }
        if (!res.ok) throw new Error('Failed to post reply');
        setReplyContent('');
        setShowReplyForm(false);
        onReplySuccess();
      })
      .finally(() => setSubmitting(false));
  };

  const indent = depth * 24;

  return (
    <div
      className="flex flex-col"
      style={{ marginLeft: indent }}
    >
      <div
        className={cn(
          'border-l-2 border-white/10 pl-4 py-3',
          depth > 0 && 'mt-1'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-muted border border-white/10">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-full h-full object-cover"
              width={36}
              height={36}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="font-medium text-foreground">@{authorUsername}</span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => onLikeComment(comment.id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors',
                  liked && 'text-primary-500'
                )}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <ThumbsUpIcon className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
                <span>{comment.likeCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircleIcon className="w-3.5 h-3.5" />
                Reply
              </button>
            </div>
            {showReplyForm && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply…"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary-500/50 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || submitting}
                    className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {submitting ? 'Posting…' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {comment.children.length > 0 && (
        <div className="flex flex-col">
          {comment.children.map((child) => (
            <CommentBlock
              key={child.id}
              comment={child}
              depth={depth + 1}
              postId={postId}
              onLikeComment={onLikeComment}
              onReplySuccess={onReplySuccess}
              likedCommentIds={likedCommentIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {
  comments: CommentTreeNode[];
  postId: number;
  onLikeComment: (commentId: number) => void;
  onReplySuccess: () => void;
  likedCommentIds: Set<number>;
}

export function CommentThread({
  comments,
  postId,
  onLikeComment,
  onReplySuccess,
  likedCommentIds,
}: CommentThreadProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentBlock
          key={comment.id}
          comment={comment}
          depth={0}
          postId={postId}
          onLikeComment={onLikeComment}
          onReplySuccess={onReplySuccess}
          likedCommentIds={likedCommentIds}
        />
      ))}
    </div>
  );
}

export function buildCommentTree(flat: ApiComment[]): CommentTreeNode[] {
  const byId = new Map<number, CommentTreeNode>();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots: CommentTreeNode[] = [];
  for (const c of byId.values()) {
    if (c.parentId == null) {
      roots.push(c);
    } else {
      const parent = byId.get(c.parentId);
      if (parent) parent.children.push(c);
      else roots.push(c);
    }
  }
  const sortByCreated = (a: CommentTreeNode, b: CommentTreeNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  roots.sort(sortByCreated);
  function sortChildren(n: CommentTreeNode) {
    n.children.sort(sortByCreated);
    n.children.forEach(sortChildren);
  }
  roots.forEach(sortChildren);
  return roots;
}
