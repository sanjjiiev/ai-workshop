import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
): Promise<NextResponse> {
  const code = params.code?.toUpperCase()

  if (!code || code.length < 6) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()

    // Fetch registration
    const { data: reg, error: regError } = await supabase
      .from('registrations')
      .select('id, name, college, track, year, referral_code, ai_welcome_message, created_at')
      .eq('referral_code', code)
      .maybeSingle()

    if (regError || !reg) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 })
    }

    // Fetch stats
    const { data: statsData } = await supabase
      .rpc('get_referral_stats', { p_code: code })

    const stats = statsData?.[0] ?? { total_referred: 0, rank: null }

    return NextResponse.json(
      {
        registration: reg,
        stats: {
          total_referred: Number(stats.total_referred),
          rank:           stats.rank ? Number(stats.rank) : null,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=15' },
      }
    )
  } catch (err) {
    console.error('[Referral lookup] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
