import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateReferralCode } from '@/lib/referral'
import { generateWelcomeMessage } from '@/lib/openrouter'
import { registrationSchema } from '@/lib/validations'
import type { RegisterApiResponse } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest): Promise<NextResponse<RegisterApiResponse>> {
  try {
    const body = await req.json()

    // ── Validate ────────────────────────────────────────────────────────────
    const parsed = registrationSchema.safeParse(body)
    if (!parsed.success) {
      const field_errors: Record<string, string> = {}
      parsed.error.errors.forEach(e => {
        const key = e.path[0]?.toString() ?? 'unknown'
        field_errors[key] = e.message
      })
      return NextResponse.json(
        { success: false, error: 'Validation failed', field_errors },
        { status: 422 }
      )
    }

    const { name, email, phone, college, year, track, referralCode } = parsed.data
    const supabase = createAdminClient()

    // ── Duplicate check ─────────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered for the workshop.' },
        { status: 409 }
      )
    }

    // ── Validate referral code (if provided) ────────────────────────────────
    let validReferredBy: string | null = null
    if (referralCode && referralCode.trim()) {
      const { data: referrer } = await supabase
        .from('registrations')
        .select('referral_code')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()

      validReferredBy = referrer?.referral_code ?? null
    }

    // ── Generate unique referral code ───────────────────────────────────────
    let referral_code = generateReferralCode(name)
    // Ensure uniqueness (collision is extremely rare but let's be safe)
    let attempts = 0
    while (attempts < 5) {
      const { data: conflict } = await supabase
        .from('registrations')
        .select('id')
        .eq('referral_code', referral_code)
        .maybeSingle()
      if (!conflict) break
      referral_code = generateReferralCode(name)
      attempts++
    }

    // ── Insert registration ─────────────────────────────────────────────────
    const { error: insertError } = await supabase.from('registrations').insert({
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      phone:        phone.trim(),
      college:      college.trim(),
      year,
      track,
      referral_code,
      referred_by:  validReferredBy,
      ip_address:   req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
      user_agent:   req.headers.get('user-agent') ?? null,
    })

    if (insertError) {
      console.error('[Register] DB insert error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Registration failed. Please try again.' },
        { status: 500 }
      )
    }

    // ── Generate AI welcome message (non-blocking background) ───────────────
    // We don't await this so the API responds fast; we update DB in background
    generateWelcomeMessage({ name, college, track, year })
      .then(async (message) => {
        await supabase
          .from('registrations')
          .update({ ai_welcome_message: message })
          .eq('referral_code', referral_code)
      })
      .catch((err) => console.error('[AI Welcome] Background update failed:', err))

    return NextResponse.json(
      { success: true, referral_code },
      { status: 201 }
    )
  } catch (err) {
    console.error('[Register] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
