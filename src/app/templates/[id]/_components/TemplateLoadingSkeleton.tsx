export function TemplateLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Template Details Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-8 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Code Preview Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-6 w-40 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Comments Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-6 w-32 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="space-y-4">
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Ratings Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-6 w-32 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-[150px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
