import { Skeleton } from '@/components/ui/skeleton';

/**
 * Mirrors PropertyPage's actual layout - title block, main gallery image +
 * thumbnail row, description/highlights cards, sidebar lead-form card - so
 * the page's real structure is visible immediately instead of a centered
 * spinner with nothing else on the page.
 */
export default function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Title block */}
      <div className="container mx-auto px-4 lg:px-6 mb-8">
        <div className="max-w-4xl">
          <Skeleton className="h-9 w-3/4 mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 lg:px-6 mb-12">
        <div className="max-w-6xl">
          <Skeleton className="w-full h-[400px] md:h-[600px] rounded-2xl mb-4" />
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 md:h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 lg:px-6 mb-12">
        <div className="max-w-6xl grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <Skeleton className="h-7 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid md:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4/5" />
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <Skeleton className="h-6 w-3/4 mb-6" />
              <Skeleton className="h-11 w-full mb-3 rounded-xl" />
              <Skeleton className="h-11 w-full mb-3 rounded-xl" />
              <Skeleton className="h-24 w-full mb-3 rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
