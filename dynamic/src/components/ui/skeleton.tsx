import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Base shimmer block - a bone-colored rectangle with a light sweep passing
 * over it. Every skeleton layout (PropertyCardSkeleton, PropertyDetailSkeleton,
 * table row skeletons) is built by sizing/positioning instances of this to
 * match the real content's shape, so the loading state previews the actual
 * layout instead of just signaling "wait" the way a spinner does.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-gp-surface', className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer motion-reduce:animate-none" />
    </div>
  );
}
