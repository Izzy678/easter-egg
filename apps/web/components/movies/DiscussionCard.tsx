'use client';

import { MessageSquareIcon, ThumbsUpIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DiscussionCardProps {
  movieTitle: string;
  topicTitle: string;
  previewText: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  stats: {
    comments: number;
    likes: number;
    timeAgo: string;
  };
  poster?: string;
  postId?: number;
  liked?: boolean;
  onLike?: () => void;
}

export function DiscussionCard({
  movieTitle,
  topicTitle,
  previewText,
  author,
  tags,
  stats,
  poster,
  postId,
  liked = false,
  onLike,
}: DiscussionCardProps) {
  const cardContent = (
    <>
      {/* Header: Movie Context */}
      <div className="flex items-center justify-between gap-3 mb-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {poster && (
            <div className="relative w-8 h-10 rounded overflow-hidden flex-shrink-0">
              <Image src={poster} alt={movieTitle} fill className="object-cover" sizes="32px" />
            </div>
          )}
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
            {movieTitle}
          </span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-medium border bg-white/5 text-muted-foreground border-white/10 group-hover:border-white/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary-500 transition-colors line-clamp-2">
          {topicTitle}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-gray-300">
          {previewText}
        </p>
      </div>

      {/* Footer: Engagement & Author */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageSquareIcon className="w-4 h-4" />
            <span>{stats.comments}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike?.();
            }}
            className={cn(
              'flex items-center gap-1.5 hover:text-white transition-colors text-muted-foreground',
              liked && 'text-primary-500'
            )}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <span className="flex-shrink-0 inline-flex" aria-hidden>
              <ThumbsUpIcon className={cn('w-4 h-4', liked && 'fill-current')} size={16} />
            </span>
            <span>{stats.likes}</span>
          </button>
          <div className="flex items-center gap-1.5 hover:text-white transition-colors ml-2 border-l border-white/10 pl-4">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>{stats.timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground">Posted by {author.name}</span>
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-background border border-white/10 flex-shrink-0">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </>
  );

  const wrapperClass =
    'group relative p-6 bg-card border border-white/5 rounded-2xl hover:bg-muted transition-all duration-300 cursor-pointer block overflow-visible';

  if (postId != null) {
    return (
      <Link href={`/movies/post/${postId}`} className={wrapperClass}>
        {cardContent}
      </Link>
    );
  }

  return <div className={wrapperClass}>{cardContent}</div>;
}
