import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { REWARD_TIERS, TRACK_META, buildReferralUrl } from '@/lib/referral'
import { formatDate, pluralize, cn } from '@/lib/utils'
import type { LeaderboardEntry } from '@/types'
import { Trophy, Users, TrendingUp, Copy, Share2, Calendar, Sparkles } from 'lucide-react'

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Referral Dashboard · ${code} | NxtWave AI Workshop`,
    description: 'Track your referrals and unlock rewards for the Build Your First AI Project workshop.',
  }
}

/* ── Server Component ── */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code: rawCode } = await params
  const code     = rawCode?.toUpperCase()
  const supabase = createAdminClient()
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Parallel fetch: registration + stats + leaderboard
  const [regRes, statsRes, lbRes] = await Promise.allSettled([
    supabase
      .from('registrations')
      .select('id, name, college, track, year, referral_code, ai_welcome_message, created_at')
      .eq('referral_code', code)
      .maybeSingle(),
    supabase.rpc('get_referral_stats', { p_code: code }),
    supabase.rpc('get_leaderboard', { limit_count: 10 }),
  ])

  const reg =
    regRes.status === 'fulfilled' ? regRes.value.data : null
  if (!reg) notFound()

  const statsRaw =
    statsRes.status === 'fulfilled' ? statsRes.value.data?.[0] : null
  const stats = {
    total_referred: Number(statsRaw?.total_referred ?? 0),
    rank:           statsRaw?.rank ? Number(statsRaw.rank) : null,
  }

  const leaderboard: LeaderboardEntry[] =
    lbRes.status === 'fulfilled'
      ? (lbRes.value.data ?? []).map((r: any) => ({
          referral_code:  r.referral_code,
          name:           r.name,
          college:        r.college,
          referral_count: Number(r.referral_count),
        }))
      : []

  const referralUrl  = buildReferralUrl(appUrl, code)
  const trackMeta    = TRACK_META.find(t => t.id === reg.track)
  const activeTier   = [...REWARD_TIERS].reverse().find(t => stats.total_referred >= t.min)
  const nextTier     = REWARD_TIERS.find(t => stats.total_referred < t.min)
  const progressPct  = nextTier
    ? Math.min(100, Math.round((stats.total_referred / nextTier.min) * 100))
    : 100

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles size={17} className="text-white" />
          </div>
          <a href="/" className="font-display font-bold text-lg text-white tracking-tight hover:opacity-80 transition-opacity">
            NxtWave <span className="text-indigo-400">AI</span>
          </a>
        </div>
        <a href="/" className="badge badge-purple hover:opacity-80 transition-opacity">
          ← Back to Registration
        </a>
      </nav>

      {/* ── HEADER ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 badge badge-green mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Registered · {formatDate(reg.created_at)}
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
          {reg.name}&apos;s Referral Hub
        </h1>
        <p className="text-slate-400">{reg.college} · {reg.year} · {trackMeta?.emoji} {trackMeta?.label}</p>
        <div className="mt-4 inline-flex items-center gap-2 glass rounded-full px-5 py-2.5">
          <span className="text-slate-500 text-xs font-medium">Your code:</span>
          <span className="font-mono font-bold text-indigo-300 tracking-widest">{code}</span>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT: Stats + Tiers */}
        <div className="lg:col-span-2 space-y-5">

          {/* AI Welcome */}
          {reg.ai_welcome_message && (
            <div className="glass-strong rounded-2xl p-5 border border-indigo-500/20"
              style={{ boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                  AI Welcome · Powered by DeepSeek
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                &ldquo;{reg.ai_welcome_message}&rdquo;
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="font-display font-bold text-3xl text-white">{stats.total_referred}</div>
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mt-1">
                <Users size={11} /> Friends Registered
              </div>
            </div>
            <div className="stat-card">
              <div className="font-display font-bold text-3xl text-violet-400">
                {stats.rank ? `#${stats.rank}` : '#—'}
              </div>
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mt-1">
                <TrendingUp size={11} /> Leaderboard Rank
              </div>
            </div>
            <div className="stat-card">
              <div className="font-display font-bold text-3xl text-amber-400">
                {activeTier?.emoji ?? '🎯'}
              </div>
              <div className="text-slate-500 text-xs mt-1">
                {activeTier?.label ?? 'Keep going!'}
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300 font-medium">
                  Next: {nextTier.emoji} {nextTier.label}
                </span>
                <span className="text-xs text-slate-500">
                  {pluralize(nextTier.min - stats.total_referred, 'friend')} to go
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-slate-500 text-xs mt-2">{nextTier.perk}</p>
            </div>
          )}

          {/* Referral Link */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Share2 size={16} className="text-indigo-400" /> Share Your Link
            </h3>
            <div className="referral-box mb-3" title="Click to copy">{referralUrl}</div>

            {/* Share CTAs — client-side only via inline script */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🚀 Join me at the FREE AI Workshop — build a real project in 60 min! ${referralUrl}`)}`}
                target="_blank" rel="noreferrer"
                className="share-btn hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.534 5.857L.017 24l6.324-1.493A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.833 0-3.55-.498-5.03-1.365l-.36-.214-3.753.885.934-3.643-.235-.375A9.945 9.945 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just signed up for this FREE AI Workshop 🤖 Build a real project in 60 min!\n\n${referralUrl}\n\n#AI #NxtWave #BuildInPublic`)}`}
                target="_blank" rel="noreferrer"
                className="share-btn hover:border-sky-500/30 hover:bg-sky-500/5 hover:text-sky-400"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-sky-400">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent('🚀 FREE AI Workshop! Build your first AI project in 60 minutes. Join me:')}`}
                target="_blank" rel="noreferrer"
                className="share-btn hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.243 14.5 3.29 13.6c-.644-.204-.657-.644.136-.953l10.76-4.15c.537-.194 1.006.131.836.944l-.46-.193z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* All Reward Tiers */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4">All Reward Tiers</h3>
            <div className="space-y-2">
              {REWARD_TIERS.map(tier => {
                const unlocked = stats.total_referred >= tier.min
                return (
                  <div key={tier.label} className={cn('tier-card flex items-center gap-3', unlocked && 'unlocked')}>
                    <span className="text-xl flex-shrink-0">{tier.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold">{tier.label}</p>
                      <p className="text-slate-500 text-xs">{tier.perk}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {unlocked
                        ? <span className="badge badge-green text-xs">Unlocked ✓</span>
                        : <span className="text-slate-600 text-xs">{tier.min - stats.total_referred} more</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Leaderboard */}
        <div className="space-y-5">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={16} className="text-amber-400" />
              <h3 className="font-display font-bold text-white text-sm">Leaderboard</h3>
            </div>

            {leaderboard.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">
                No referrals yet. Be the first! 🚀
              </p>
            ) : (
              <ul className="space-y-3">
                {leaderboard.map((leader, i) => (
                  <li
                    key={leader.referral_code}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-xl transition-colors',
                      leader.referral_code === code && 'bg-indigo-500/10 border border-indigo-500/20'
                    )}
                  >
                    <span className="text-sm w-5 text-center flex-shrink-0">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">
                        {leader.referral_code === code ? `${leader.name} (You)` : leader.name}
                      </p>
                      <p className="text-slate-500 text-xs truncate">{leader.college}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={10} className="text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-bold">{leader.referral_count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Workshop info widget */}
          <div className="glass rounded-xl p-4 space-y-3">
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest">Workshop Details</h4>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Calendar size={13} className="text-indigo-400 flex-shrink-0" />
              <span>{process.env.NEXT_PUBLIC_WORKSHOP_DATE ?? 'Saturday, 18 Oct 2026'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Copy size={13} className="text-indigo-400 flex-shrink-0" />
              <span>Build Your First AI Project in 60 Minutes</span>
            </div>
            <div className="pt-1">
              <a href="/" className="btn-secondary w-full text-xs py-2.5">
                ← Back to Registration
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
