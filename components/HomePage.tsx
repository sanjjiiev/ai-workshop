'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Zap, Users, Calendar, Clock, Star,
  BookOpen, Rocket, Award, Shield, ChevronRight,
  Sparkles,
} from 'lucide-react'
import RegistrationForm from '@/components/RegistrationForm'
import ReferralDashboard from '@/components/ReferralDashboard'
import type { LeaderboardEntry, ReferralStats } from '@/types'
import { TRACK_META } from '@/lib/referral'

/* ── Types ──────────────────────────────────────────────────── */
type Step = 'form' | 'success'

interface PageState {
  step:          Step
  referralCode:  string
  aiWelcome:     string | null
  userName:      string
  stats:         ReferralStats
  leaderboard:   LeaderboardEntry[]
  seatsLeft:     number
  totalSeats:    number
  workshopDate:  string
  workshopTime:  string
}

/* ── Agenda items ───────────────────────────────────────────── */
const AGENDA = [
  { icon: <Zap size={16} className="text-indigo-400" />,    bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)', title: 'API Setup in 10 min',         desc: 'Get your key, make your first AI call live'  },
  { icon: <Rocket size={16} className="text-violet-400" />, bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', title: 'Build & Ship on Camera',       desc: 'Ship a working feature with the host'        },
  { icon: <BookOpen size={16} className="text-emerald-400" />, bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', title: 'Deploy to Vercel',          desc: 'Live URL in under 5 minutes'                 },
  { icon: <Award size={16} className="text-amber-400" />,   bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)', title: 'Certificate + Resume Kit',    desc: 'Verified certificate for all attendees'      },
]

const REVIEWS = [
  { name: 'Aditya R.', college: 'VIT Vellore',   color: '#818cf8', text: 'Shipped a working AI chatbot in the session itself. Absolutely insane experience!' },
  { name: 'Kavya P.',  college: 'BITS Goa',       color: '#34d399', text: 'The referral perks got my entire hostel floor to sign up 😂 Worth it though!' },
  { name: 'Rahul S.',  college: 'IIT Kharagpur',  color: '#fb923c', text: 'Best free workshop I\'ve attended in college. The AI output was actually impressive.' },
]

/* ── Main Component ─────────────────────────────────────────── */
export default function HomePage({
  defaultReferralCode,
  initialSeatsLeft,
  totalSeats,
  workshopDate,
  workshopTime,
  initialLeaderboard,
}: {
  defaultReferralCode: string
  initialSeatsLeft:    number
  totalSeats:          number
  workshopDate:        string
  workshopTime:        string
  initialLeaderboard:  LeaderboardEntry[]
}) {
  const [state, setState] = useState<PageState>({
    step:          'form',
    referralCode:  '',
    aiWelcome:     null,
    userName:      '',
    stats:         { total_referred: 0, rank: 0 },
    leaderboard:   initialLeaderboard,
    seatsLeft:     initialSeatsLeft,
    totalSeats,
    workshopDate,
    workshopTime,
  })

  // FOMO: slowly decrement seats
  const tickRef = useRef<ReturnType<typeof setInterval>>()
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setState(s => ({
        ...s,
        seatsLeft: s.seatsLeft > Math.floor(totalSeats * 0.35)
          ? s.seatsLeft - (Math.random() < 0.4 ? 1 : 0)
          : s.seatsLeft,
      }))
    }, 9000)
    return () => clearInterval(tickRef.current)
  }, [totalSeats])

  const handleSuccess = useCallback(async (referralCode: string, aiWelcome: string | null) => {
    // Fetch latest stats + leaderboard
    const [refRes, lbRes] = await Promise.all([
      fetch(`/api/referral/${referralCode}`),
      fetch('/api/leaderboard'),
    ])

    let stats: ReferralStats      = { total_referred: 0, rank: 0 }
    let leaderboard: LeaderboardEntry[] = state.leaderboard
    let userName = ''

    if (refRes.ok) {
      const data = await refRes.json()
      stats    = data.stats
      userName = data.registration?.name ?? ''
    }
    if (lbRes.ok) {
      const data = await lbRes.json()
      leaderboard = data.leaderboard ?? []
    }

    setState(s => ({
      ...s,
      step: 'success',
      referralCode,
      aiWelcome,
      userName,
      stats,
      leaderboard,
      seatsLeft: Math.max(s.seatsLeft - 1, 0),
    }))

    toast.success(`You're in, ${userName.split(' ')[0]}! 🎉 Check WhatsApp for confirmation.`, { duration: 5000 })
  }, [state.leaderboard])

  const pct = Math.round(((state.totalSeats - state.seatsLeft) / state.totalSeats) * 100)

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            NxtWave <span className="text-indigo-400">AI</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="badge badge-green">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Registration
          </span>
          <span className="badge badge-purple">Free Workshop</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 badge badge-orange mb-6">
          <Zap size={13} />
          60-Minute Live Session · {state.workshopDate}
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5">
          Build Your First<br />
          <span className="shimmer-text">AI Project</span><br />
          in 60 Minutes
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Go from zero to shipping a working AI-powered app — live, hands-on,
          and absolutely <strong className="text-white">free</strong>.
          Built for university students.
        </p>

        {/* Seat Counter */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Users size={14} />
            <span>
              <strong className="text-white">{state.seatsLeft}</strong> seats remaining
            </span>
          </div>
          <div className="w-72 progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-slate-500">
            {state.totalSeats - state.seatsLeft} / {state.totalSeats} spots filled
          </span>
        </div>

        {/* Meta chips */}
        <div className="flex items-center justify-center flex-wrap gap-3 mt-6">
          <span className="badge badge-blue"><Calendar size={11} />{state.workshopDate}</span>
          <span className="badge badge-blue"><Clock size={11} />{state.workshopTime}</span>
          <span className="badge badge-green"><Shield size={11} />Free · No CC Required</span>
        </div>
      </motion.header>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-5 gap-8 items-start max-w-7xl mx-auto">

        {/* LEFT: Form / Success */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">

            {/* ── FORM STATE ── */}
            {state.step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-strong rounded-2xl p-8"
                style={{ boxShadow: '0 25px 80px rgba(99,102,241,0.14)' }}
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Star size={17} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">Register Now</h2>
                    <p className="text-slate-500 text-xs">Takes less than 60 seconds</p>
                  </div>
                </div>

                <RegistrationForm
                  defaultReferralCode={defaultReferralCode}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            )}

            {/* ── SUCCESS STATE ── */}
            {state.step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-2xl p-8"
                style={{ boxShadow: '0 25px 80px rgba(16,185,129,0.12)' }}
              >
                {/* Checkmark */}
                <div className="text-center mb-8">
                  <div className="relative w-24 h-24 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"
                      style={{ boxShadow: '0 0 40px rgba(16,185,129,0.45)' }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                        <path
                          className="animate-draw-check"
                          d="M5 13l4 4L19 7"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white mb-1">
                    You&apos;re In! 🎉
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Welcome, <strong className="text-white">{state.userName.split(' ')[0]}</strong>!
                    Check your WhatsApp for the confirmation.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 glass rounded-full px-4 py-2">
                    <span className="font-mono text-xs text-indigo-400">Your code:</span>
                    <span className="font-display font-bold text-white text-sm tracking-widest">
                      {state.referralCode}
                    </span>
                  </div>
                </div>

                <ReferralDashboard
                  referralCode={state.referralCode}
                  aiWelcome={state.aiWelcome}
                  name={state.userName}
                  initialStats={state.stats}
                  leaderboard={state.leaderboard}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── n8n / WhatsApp API Doc ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <Shield size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-white">WhatsApp Automation · n8n Webhook</p>
                  <p className="text-slate-500 text-xs">Payload structure for Zapier / n8n integration</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="badge badge-green text-xs">POST /api/register</span>
                <span className="badge badge-purple text-xs">n8n · Zapier</span>
              </div>
            </div>

            <div className="code-block text-xs leading-relaxed overflow-x-auto">
              <span className="text-slate-500">{'// ── n8n Node: Webhook → WhatsApp confirmation ─────────────────'}</span>{'\n'}
              <span className="text-blue-300">{'POST'}</span>{' '}
              <span className="text-green-300">{'https://your-n8n.cloud/webhook/ai-workshop'}</span>{'\n\n'}
              <span className="text-slate-500">{'// ── Payload (forwarded from /api/register) ─────────────────────'}</span>{'\n'}
              {'{'}{'\n'}
              {'  '}<span className="text-blue-300">{'"name"'}</span>{': '}<span className="text-green-300">{'"Arjun Mehta"'}</span>{','}{'\n'}
              {'  '}<span className="text-blue-300">{'"phone"'}</span>{': '}<span className="text-green-300">{'"  +91-9876543210"'}</span>{','}{'\n'}
              {'  '}<span className="text-blue-300">{'"referral_code"'}</span>{': '}<span className="text-green-300">{'"ARJ-3K29MQ7B"'}</span>{','}{'\n'}
              {'  '}<span className="text-blue-300">{'"track"'}</span>{': '}<span className="text-green-300">{'"chatbot"'}</span>{','}{'\n'}
              {'  '}<span className="text-blue-300">{'"ai_welcome"'}</span>{': '}<span className="text-green-300">{'"<DeepSeek generated msg>"'}</span>{','}{'\n'}
              {'  '}<span className="text-blue-300">{'"referral_url"'}</span>{': '}<span className="text-green-300">{'"https://yourapp.vercel.app?ref=ARJ-3K29MQ7B"'}</span>{'\n'}
              {'}'}{'\n\n'}
              <span className="text-slate-500">{'// ── n8n chain ──────────────────────────────────────────────────'}</span>{'\n'}
              <span className="text-slate-500">{'// [Webhook] → [WhatsApp API node] → [Google Sheets log]'}</span>{'\n'}
              <span className="text-slate-500">{'// → [IF: referred_by?] → [Notify referrer "+1 friend registered!"]'}</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="lg:col-span-2 space-y-5">

          {/* Workshop Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-2xl p-6"
          >
            <h3 className="font-display font-bold text-base text-white mb-5">What&apos;s Inside</h3>
            <ul className="space-y-4">
              {AGENDA.map(item => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{item.title}</p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Track Previews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="font-display font-semibold text-sm text-white mb-4">Choose Your Track</h3>
            <div className="space-y-2">
              {TRACK_META.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors">
                  <span className="text-xl">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white text-xs font-semibold">{t.label}</p>
                    <p className="text-slate-500 text-xs">{t.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard teaser (pre-registration) */}
          {state.step === 'form' && initialLeaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-semibold text-sm text-white flex items-center gap-2">
                  <span>🏆</span> Top Referrers
                </p>
                <span className="text-xs text-slate-500">This week</span>
              </div>
              <ul className="space-y-3">
                {initialLeaderboard.slice(0, 3).map((leader, i) => (
                  <li key={leader.referral_code} className="flex items-center gap-3">
                    <span className="text-base">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{leader.name}</p>
                      <p className="text-slate-500 text-xs truncate">{leader.college}</p>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">{leader.referral_count} refs</span>
                  </li>
                ))}
              </ul>
              <p className="text-center text-slate-600 text-xs mt-3">Register to join the leaderboard →</p>
            </motion.div>
          )}

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="font-display font-semibold text-sm text-white mb-4">What students say</h3>
            <div className="space-y-3">
              {REVIEWS.map(r => (
                <div key={r.name} className="p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">&ldquo;{r.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${r.color}25`, color: r.color }}>
                      {r.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-xs font-semibold">{r.name}</p>
                      <p className="text-slate-600 text-xs">{r.college}</p>
                    </div>
                    <span className="text-amber-400 text-xs">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-xs">© 2026 NxtWave Technologies · AI Workshop Series</p>
        <div className="flex items-center gap-4 text-slate-600 text-xs">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Contact</span>
        </div>
      </footer>
    </div>
  )
}
