import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { LeaderboardEntry } from '@/types'

export const runtime = 'nodejs'
export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .rpc('get_leaderboard', { limit_count: 10 })

    if (error) {
      console.error('[Leaderboard] RPC error:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    const leaderboard: LeaderboardEntry[] = (data ?? []).map((row: any) => ({
      referral_code:  row.referral_code,
      name:           row.name,
      college:        row.college,
      referral_count: Number(row.referral_count),
    }))

    // Also return total registration count
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json(
      { leaderboard, total_registrations: count ?? 0 },
      {
        status: 200,
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
      }
    )
  } catch (err) {
    console.error('[Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
