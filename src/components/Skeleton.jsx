/**
 * Skeleton loading components for initial app hydration.
 * Shows placeholder pulse animations while data loads.
 */

function SkeletonPulse({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-surface-200 dark:bg-surface-800 ${className}`} />
  )
}

/**
 * Skeleton for summary cards row.
 */
export function SummaryCardSkeleton() {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-8 w-36" />
          <SkeletonPulse className="h-3 w-32" />
        </div>
        <SkeletonPulse className="h-11 w-11 rounded-xl shrink-0" />
      </div>
    </div>
  )
}

/**
 * Skeleton for a chart card.
 */
export function ChartSkeleton() {
  return (
    <div className="card p-6">
      <SkeletonPulse className="h-4 w-32 mb-4" />
      <SkeletonPulse className="h-[260px] w-full rounded-xl" />
    </div>
  )
}

/**
 * Skeleton for the insights row.
 */
export function InsightsSkeleton() {
  return (
    <div>
      <SkeletonPulse className="h-5 w-36 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-start gap-3">
              <SkeletonPulse className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-6 w-24" />
                <SkeletonPulse className="h-3 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton for the transactions table.
 */
export function TransactionTableSkeleton() {
  return (
    <div className="card">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="h-5 w-28" />
          <SkeletonPulse className="h-10 w-36 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <SkeletonPulse className="h-10 flex-1 max-w-sm rounded-xl" />
          <SkeletonPulse className="h-10 w-40 rounded-xl" />
        </div>
      </div>
      <div className="px-5 sm:px-6 py-3 border-t border-surface-100 dark:border-surface-800 space-y-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3.5 border-b border-surface-50 dark:border-surface-800/50 last:border-0"
          >
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-4 w-40 flex-1" />
            <SkeletonPulse className="h-4 w-20 hidden sm:block" />
            <SkeletonPulse className="h-5 w-16 rounded-full hidden md:block" />
            <SkeletonPulse className="h-4 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Full dashboard skeleton layout.
 */
export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
      </div>

      {/* Insights */}
      <InsightsSkeleton />

      {/* Table */}
      <TransactionTableSkeleton />
    </div>
  )
}
