import { Suspense } from 'react'
import { createAdminClient } from '@/lib/supabase/server'
import HomePage from '@/components/HomePage'
import type { LeaderboardEntry } from '@/types'

/* ── Server Component: fetch all initial data ── */
export default async function Page({
  searchParams,
}: {
  searchParams: { ref?: string }
}) {
  const supabase            = createAdminClient()
  const totalSeats          = Number(process.env.NEXT_PUBLIC_TOTAL_SEATS ?? 500)
  const defaultReferralCode = searchParams?.ref?.toUpperCase() ?? ''

  // Fetch seat count and leaderboard in parallel
  const [countRes, lbRes] = await Promise.allSettled([
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.rpc('get_leaderboard', { limit_count: 10 }),
  ])

  const seatsTaken        = countRes.status === 'fulfilled' ? (countRes.value.count ?? 0) : 0
  const initialSeatsLeft  = Math.max(totalSeats - seatsTaken, 0)
  const initialLeaderboard: LeaderboardEntry[] =
    lbRes.status === 'fulfilled'
      ? (lbRes.value.data ?? []).map((r: any) => ({
          referral_code:  r.referral_code,
          name:           r.name,
          college:        r.college,
          referral_count: Number(r.referral_count),
        }))
      : []

  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePage
        defaultReferralCode={defaultReferralCode}
        initialSeatsLeft={initialSeatsLeft}
        totalSeats={totalSeats}
        workshopDate={process.env.NEXT_PUBLIC_WORKSHOP_DATE ?? 'Saturday, 18 Oct 2026'}
        workshopTime={process.env.NEXT_PUBLIC_WORKSHOP_TIME ?? '7:00 PM IST'}
        initialLeaderboard={initialLeaderboard}
      />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading workshop…</p>
      </div>
    </div>
  )
}
