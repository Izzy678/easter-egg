'use client';

import { Skeleton } from '@/components/shared/ui/skeleton';
import { cn } from '@/lib/utils';

interface RecapMediaCardSkeletonProps {
  className?: string;
}

export function RecapMediaCardSkeleton({ className }: RecapMediaCardSkeletonProps) {
  return (
    <div className={cn('w-36 sm:w-40 flex-shrink-0', className)}>
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mt-2 h-4 w-3/4 rounded" />
      <Skeleton className="mt-1.5 h-3 w-1/3 rounded" />
    </div>
  );
}
