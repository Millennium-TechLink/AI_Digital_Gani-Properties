import { Skeleton } from '@/components/ui/skeleton';

/**
 * Mirrors PropertyCard's grid-variant markup (same photo height, same
 * padding, same stack order: tag pill, title, location, price) so the
 * loading grid previews the real card shape rather than a generic block.
 */
export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gp-ink/10 h-full flex flex-col">
      <Skeleton className="h-[150px] sm:h-[280px] rounded-none" />
      <div className="pt-6 px-4 pb-4 sm:pt-10 sm:px-8 sm:pb-8 flex-1 flex flex-col min-h-[150px] sm:min-h-[240px]">
        <Skeleton className="h-5 w-4/5 mb-3 sm:mb-4" />
        <Skeleton className="h-4 w-2/5 mb-4 sm:mb-6" />
        <Skeleton className="h-5 w-1/3 mb-4" />
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
