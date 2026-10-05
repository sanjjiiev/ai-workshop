'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, Building2, BookOpen, Zap,
  Link2, CheckCircle2, Loader2, ChevronDown,
} from 'lucide-react'
import { registrationSchema, type RegistrationInput } from '@/lib/validations'
import { generateReferralCode, TRACK_META } from '@/lib/referral'
import { cn } from '@/lib/utils'
import type { RegisterApiResponse } from '@/types'

interface Props {
  defaultReferralCode?: string
  onSuccess: (referralCode: string, aiWelcome: string | null) => void
}

export default function RegistrationForm({ defaultReferralCode = '', onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      referralCode: defaultReferralCode,
      terms: false,
    },
  })

  const watchedTrack = watch('track')
  const watchedTerms = watch('terms')

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true)
    try {
      const referral_code = generateReferralCode(data.name)

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          referral_code,
          referred_by: data.referralCode?.trim().toUpperCase() || undefined,
        }),
      })

      const json: RegisterApiResponse = await res.json()

      if (!res.ok || !json.success) {
        // Surface field-level errors if present
        if (json.field_errors) {
          Object.entries(json.field_errors).forEach(([, msg]) => {
            toast.error(msg)
          })
        } else {
          toast.error(json.error ?? 'Registration failed. Please try again.')
        }
        return
      }

      // Poll for AI welcome message (it's generated async server-side)
      let aiWelcome: string | null = null
      for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 1500))
        try {
          const refRes = await fetch(`/api/referral/${json.referral_code}`)
          if (refRes.ok) {
            const refData = await refRes.json()
            if (refData.registration?.ai_welcome_message) {
              aiWelcome = refData.registration.ai_welcome_message
              break
            }
          }
        } catch { /* ignore polling errors */ }
      }

      onSuccess(json.referral_code!, aiWelcome)
    } catch {
      toast.error('Network error. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* ── Full Name ── */}
      <Field label="Full Name" error={errors.name?.message} required>
        <InputIcon icon={<User size={16} />} />
        <input
          {...register('name')}
          type="text"
          placeholder="e.g. Arjun Mehta"
          className={cn('input-base', errors.name && 'error')}
          autoComplete="name"
          disabled={isSubmitting}
        />
      </Field>

      {/* ── Email + Phone ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="College Email" error={errors.email?.message} required>
          <InputIcon icon={<Mail size={16} />} />
          <input
            {...register('email')}
            type="email"
            placeholder="you@college.edu"
            className={cn('input-base', errors.email && 'error')}
            autoComplete="email"
            disabled={isSubmitting}
          />
        </Field>

        <Field label="WhatsApp Number" error={errors.phone?.message} required>
          <InputIcon icon={<Phone size={16} />} />
          <input
            {...register('phone')}
            type="tel"
            placeholder="+91 98765 43210"
            className={cn('input-base', errors.phone && 'error')}
            autoComplete="tel"
            disabled={isSubmitting}
          />
        </Field>
      </div>

      {/* ── College + Year ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="College / University" error={errors.college?.message} required>
          <InputIcon icon={<Building2 size={16} />} />
          <input
            {...register('college')}
            type="text"
            placeholder="IIT Bombay, BITS Pilani…"
            className={cn('input-base', errors.college && 'error')}
            disabled={isSubmitting}
          />
        </Field>

        <Field label="Year of Study" error={errors.year?.message} required>
          <InputIcon icon={<BookOpen size={16} />} />
          <select
            {...register('year')}
            className={cn('input-base', errors.year && 'error')}
            disabled={isSubmitting}
            defaultValue=""
          >
            <option value="" disabled>Select year…</option>
            {['1st Year','2nd Year','3rd Year','4th Year','Post-Graduate'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ChevronDown size={15} />
          </span>
        </Field>
      </div>

      {/* ── Track Selector ── */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-3">
          What do you want to build? <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRACK_META.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setValue('track', t.id, { shouldValidate: true })}
              className={cn('track-card', watchedTrack === t.id && 'selected')}
              disabled={isSubmitting}
            >
              <div className="text-2xl mb-1.5">{t.emoji}</div>
              <div className="text-xs font-semibold text-slate-200 leading-tight">{t.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight hidden sm:block">{t.desc}</div>
            </button>
          ))}
        </div>
        {errors.track && (
          <p className="text-rose-400 text-xs mt-1.5">{errors.track.message}</p>
        )}
      </div>

      {/* ── Referral Code ── */}
      <Field label="Referral Code" hint="Got a code from a friend? Paste it here.">
        <InputIcon icon={<Link2 size={16} />} />
        <input
          {...register('referralCode')}
          type="text"
          placeholder="e.g. ARJ-3K29MQ7B"
          className="input-base uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          disabled={isSubmitting}
        />
      </Field>

      {/* ── Terms ── */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setValue('terms', !watchedTerms, { shouldValidate: true })}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all',
            watchedTerms
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-white/20 hover:border-indigo-500/50'
          )}
          disabled={isSubmitting}
        >
          <AnimatePresence>
            {watchedTerms && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CheckCircle2 size={13} className="text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <span className="text-slate-400 text-sm leading-relaxed">
          I agree to receive workshop updates &amp; resources on WhatsApp.{' '}
          <span className="text-indigo-400 hover:underline cursor-pointer">Privacy Policy</span>
        </span>
      </div>
      {errors.terms && (
        <p className="text-rose-400 text-xs -mt-2">{errors.terms.message}</p>
      )}

      {/* ── Submit ── */}
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Locking in your spot…
          </>
        ) : (
          <>
            <Zap size={18} />
            Claim My Free Spot
          </>
        )}
      </button>

      <p className="text-center text-slate-600 text-xs">
        🔒 No spam. No credit card. Unsubscribe anytime.
      </p>
    </form>
  )
}

/* ── Sub-components ─────────────────────────────────────── */

function Field({
  label, error, hint, required, children,
}: {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <div className="relative">{children}</div>
      {error  && <p className="text-rose-400 text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-slate-500 text-xs mt-1.5">{hint}</p>}
    </div>
  )
}

function InputIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
      {icon}
    </span>
  )
}
