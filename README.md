# 🚀 NxtWave AI Workshop — Viral Referral Platform

> **Build Your First AI Project in 60 Minutes** — registration + viral referral system powered by **Next.js 14 · Supabase · DeepSeek (OpenRouter)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-workshop-referral)

---

## ✨ Features

| Feature | Stack |
|---|---|
| Server-rendered registration page | Next.js 14 App Router (RSC) |
| Validated form | `react-hook-form` + `zod` |
| Unique referral code per registrant | `nanoid` — human-readable, collision-safe |
| Referral tracking & leaderboard | Supabase PostgreSQL + RPC functions |
| AI-generated welcome message | **DeepSeek Chat** via **OpenRouter API** |
| One-click share to WhatsApp / Twitter / Telegram | Native share URLs |
| Real-time seat counter (FOMO) | Server-fetched on every load |
| Reward tiers (1 / 3 / 5 / 10 friends) | Computed from live DB stats |
| Full dashboard at `/dashboard/[code]` | Server Component |
| Row-level security | Supabase RLS policies |
| Edge-compatible API routes | `export const runtime = 'edge'` |
| Vercel-ready | `vercel.json` + `bom1` region (Mumbai) |

---

## 🗂 Project Structure

```
ai-workshop/
├── app/
│   ├── layout.tsx                  # Root layout + Toaster
│   ├── globals.css                 # Design system (glassmorphism)
│   ├── page.tsx                    # Home (Server Component)
│   ├── dashboard/[code]/
│   │   └── page.tsx                # Referral dashboard (Server Component)
│   └── api/
│       ├── register/route.ts       # POST — registration endpoint
│       ├── leaderboard/route.ts    # GET  — leaderboard
│       └── referral/[code]/
│           └── route.ts            # GET  — referral stats lookup
├── components/
│   ├── HomePage.tsx                # Full page client component
│   ├── RegistrationForm.tsx        # react-hook-form + zod form
│   └── ReferralDashboard.tsx       # Post-registration referral UI
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server + Admin Supabase client
│   ├── openrouter.ts               # DeepSeek via OpenRouter
│   ├── referral.ts                 # Code gen, reward tiers, track meta
│   ├── validations.ts              # Zod schema
│   └── utils.ts                    # cn(), formatDate(), etc.
├── types/index.ts                  # Shared TypeScript types
├── supabase/migrations/
│   └── 001_initial_schema.sql      # Run in Supabase SQL Editor
├── .env.local.example              # Copy → .env.local, fill in keys
├── vercel.json                     # Vercel deployment config
└── next.config.ts
```

---

## ⚡ Quick Start

### 1 · Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-workshop-referral
cd ai-workshop-referral
npm install
```

### 2 · Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → paste & run `supabase/migrations/001_initial_schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 3 · Get OpenRouter Key

1. Go to [openrouter.ai](https://openrouter.ai) → Create Account
2. Dashboard → **API Keys** → Create key
3. Add **DeepSeek Chat** credit (very cheap: ~\$0.0001/request)

### 4 · Configure Environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

OPENROUTER_API_KEY=sk-or-v1-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WORKSHOP_DATE=Saturday, 18 Oct 2026
NEXT_PUBLIC_WORKSHOP_TIME=7:00 PM IST
NEXT_PUBLIC_TOTAL_SEATS=500
```

### 5 · Run Locally

```bash
npm run dev
# → http://localhost:3000
```

---

## 🚢 Deploy to Vercel

```bash
# Push to GitHub first
git init && git add . && git commit -m "feat: initial production app"
git remote add origin https://github.com/YOUR_USERNAME/ai-workshop-referral
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **Import Project** → pick your repo
2. Add all env vars from `.env.local` in the Vercel dashboard
3. **Deploy** → your app is live in ~60 seconds 🎉

> Change `NEXT_PUBLIC_APP_URL` to your Vercel URL after first deploy.

---

## 🗄 Database Schema

| Table | Purpose |
|---|---|
| `registrations` | All registrant data + referral codes |
| `workshop_config` | Config KV store (seats, dates) |

### Key RPC functions
- `get_leaderboard(limit_count)` — top referrers
- `get_referral_stats(p_code)` — count + rank for a code

---

## 🤖 AI Integration (DeepSeek via OpenRouter)

On registration, the API:
1. Inserts the record synchronously → responds immediately (fast!)
2. Calls `generateWelcomeMessage()` **in the background** (non-blocking)
3. Updates `ai_welcome_message` in DB once DeepSeek responds
4. The client polls `/api/referral/[code]` every 1.5s for up to 9s to show the message

---

## 🔑 API Reference

### `POST /api/register`
```json
{
  "name": "Arjun Mehta",
  "email": "arjun@college.edu",
  "phone": "+91-9876543210",
  "college": "IIT Bombay",
  "year": "3rd Year",
  "track": "chatbot",
  "referral_code": "ARJ-3K29MQ7B",
  "referred_by": "XYZ-OPTIONAL"
}
```
**Response:** `{ "success": true, "referral_code": "ARJ-3K29MQ7B" }`

### `GET /api/referral/[code]`
Returns registration details + `{ total_referred, rank }`

### `GET /api/leaderboard`
Returns top 10 referrers + `total_registrations`

---

## 🏆 Reward Tiers

| Referrals | Tier | Reward |
|---|---|---|
| 1+ | 🎁 Starter | Priority Q&A slot |
| 3+ | 🏅 Hustler | Exclusive resource pack |
| 5+ | 🚀 Pro | 1:1 AI career mentorship (30 min) |
| 10+ | 👑 Legend | NxtWave Pro — 1 month free |

---

## 📝 License

MIT © 2026 NxtWave Technologies
