'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Copy, Share2, Trophy, Users, TrendingUp,
  ExternalLink, MessageCircle, Twitter, Send,
} from 'lucide-react'
import { buildReferralUrl, REWARD_TIERS } from '@/lib/referral'
import { cn, pluralize } from '@/lib/utils'
import type { ReferralStats, LeaderboardEntry } from '@/types'

interface Props {
  referralCode: string
  aiWelcome:    string | null
  name:         string
  initialStats: ReferralStats
  leaderboard:  LeaderboardEntry[]
}

export default function ReferralDashboard({
  referralCode,
  aiWelcome,
  name,
  initialStats,
  leaderboard,
}: Props) {
  const [stats, setStats]   = useState(initialStats)
  const appUrl              = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const referralUrl         = buildReferralUrl(appUrl, referralCode)

  // Refresh stats from server
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/referral/${referralCode}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch { /* silent */ }
  }, [referralCode])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      toast.success('Referral link copied! 🔗')
    } catch {
      toast.error('Could not copy. Try manually.')
    }
  }

  const shareWA = () => {
    const msg = encodeURIComponent(
      `🚀 I just registered for the FREE "Build Your First AI Project in 60 Minutes" workshop by NxtWave!\n\nShip a real AI project in ONE hour 🤖 Join me → ${referralUrl}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
    incrementInvited()
  }

  const shareTwitter = () => {
    const msg = encodeURIComponent(
      `Just signed up for this FREE AI workshop 🤖 Build a real project in 60 minutes!\n\n→ ${referralUrl}\n\n#AI #BuildInPublic #NxtWave`
    )
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, '_blank')
    incrementInvited()
  }

  const shareTelegram = () => {
    const msg = encodeURIComponent(
      `🚀 FREE AI Workshop alert! Build your first AI project in 60 minutes. Join me: ${referralUrl}`
    )
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${msg}`, '_blank')
    incrementInvited()
  }

  function incrementInvited() {
    // Optimistic UI update; real count comes from server on next refresh
    setTimeout(refreshStats, 3000)
  }

  const activeTier = [...REWARD_TIERS]
    .reverse()
    .find(t => stats.total_referred >= t.min)

  return (
    <div className="space-y-5">
      {/* ── AI Welcome Message ── */}
      {aiWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-5 border border-indigo-500/20"
          style={{ boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤖</span>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              AI-Generated Welcome · DeepSeek
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            &ldquo;{aiWelcome}&rdquo;
          </p>
        </motion.div>
      )}

      {/* ── Referral Hub ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
        style={{ boxShadow: '0 0 50px rgba(99,102,241,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <Share2 size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white">Your Referral Hub</h3>
            <p className="text-slate-500 text-xs">Invite friends · Unlock rewards</p>
          </div>
          <button
            onClick={refreshStats}
            className="ml-auto btn-ghost text-xs"
            title="Refresh stats"
          >
            <TrendingUp size={13} /> Refresh
          </button>
        </div>

        {/* Unique link */}
        <div className="mb-5">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Your Unique Link
          </p>
          <div className="referral-box" onClick={copyLink} title="Click to copy">
            {referralUrl}
          </div>
          <button onClick={copyLink} className="btn-secondary w-full mt-2">
            <Copy size={14} />
            Copy Referral Link
          </button>
        </div>

        {/* Share row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={shareWA}
            className={cn('share-btn hover:border-emerald-500/30 hover:bg-emerald-500/08 hover:text-emerald-400')}
          >
            <MessageCircle size={20} className="text-emerald-400" />
            WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className={cn('share-btn hover:border-sky-500/30 hover:bg-sky-500/08 hover:text-sky-400')}
          >
            <Twitter size={20} className="text-sky-400" />
            Twitter / X
          </button>
          <button
            onClick={shareTelegram}
            className={cn('share-btn hover:border-blue-500/30 hover:bg-blue-500/08 hover:text-blue-400')}
          >
            <Send size={20} className="text-blue-400" />
            Telegram
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="stat-card">
            <div className="font-display font-bold text-2xl text-white">{stats.total_referred}</div>
            <div className="text-slate-500 text-xs mt-0.5">Registered</div>
          </div>
          <div className="stat-card">
            <div className="font-display font-bold text-2xl text-emerald-400">
              {activeTier ? activeTier.emoji : '—'}
            </div>
            <div className="text-slate-500 text-xs mt-0.5">Tier</div>
          </div>
          <div className="stat-card">
            <div className="font-display font-bold text-2xl text-violet-400">
              {stats.rank ? `#${stats.rank}` : '#—'}
            </div>
            <div className="text-slate-500 text-xs mt-0.5">Rank</div>
          </div>
        </div>

        {/* Reward Tiers */}
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Reward Tiers
          </p>
          <div className="space-y-2">
            {REWARD_TIERS.map(tier => {
              const unlocked = stats.total_referred >= tier.min
              return (
                <div key={tier.label} className={cn('tier-card flex items-center gap-3', unlocked && 'unlocked')}>
                  <span className="text-xl flex-shrink-0">{tier.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{tier.label}</p>
                    <p className="text-slate-500 text-xs truncate">{tier.perk}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {unlocked ? (
                      <span className="badge badge-green text-xs">Unlocked ✓</span>
                    ) : (
                      <span className="text-slate-600 text-xs">
                        {pluralize(tier.min - stats.total_referred, 'more')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Leaderboard ── */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-400" />
              <p className="font-display font-semibold text-sm text-white">Top Referrers</p>
            </div>
            <span className="text-xs text-slate-500">Live</span>
          </div>
          <ul className="space-y-3">
            {leaderboard.slice(0, 5).map((leader, i) => (
              <li key={leader.referral_code} className="flex items-center gap-3">
                <span className="text-base w-6 text-center flex-shrink-0">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">
                    {leader.referral_code === referralCode ? `${leader.name} (You!)` : leader.name}
                  </p>
                  <p className="text-slate-500 text-xs truncate">{leader.college}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Users size={12} />
                  <span className="text-xs font-bold">{leader.referral_count}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── Dashboard link ── */}
      <a
        href={`/dashboard/${referralCode}`}
        className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
      >
        <ExternalLink size={14} />
        Open Full Dashboard
      </a>
    </div>
  )
}
