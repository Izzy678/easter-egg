'use client';

import { Skeleton } from '@/components/shared/ui/skeleton';

export function DiscussionCardSkeleton() {
  return (
    <div className="p-6 bg-card border border-white/5 rounded-2xl">
      {/* Header: poster + movie title + tags */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-10 rounded flex-shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Main: title + preview lines */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-6 w-full max-w-md" />
        <Skeleton className="h-6 w-[85%] max-w-sm" />
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[75%]" />
      </div>

      {/* Footer: stats + author */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12 ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
