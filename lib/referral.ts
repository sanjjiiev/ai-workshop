import { customAlphabet } from 'nanoid'

// URL-safe, human-readable alphabet (no confusing chars: 0/O, 1/I/l)
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const generateId = customAlphabet(alphabet, 8)

/**
 * Generates a unique referral code in the format: NAME3-XXXXXXXX
 * e.g. ARJ-3K29MQ7B
 */
export function generateReferralCode(name: string): string {
  const prefix = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X')
  const suffix = generateId()
  return `${prefix}-${suffix}`
}

/** Extracts first name for display */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

/** Build the shareable referral URL */
export function buildReferralUrl(baseUrl: string, code: string): string {
  const url = new URL(baseUrl)
  url.searchParams.set('ref', code)
  return url.toString()
}

export const REWARD_TIERS = [
  { min: 1,  emoji: '🎁', label: 'Starter',  perk: 'Priority Q&A slot in the live session' },
  { min: 3,  emoji: '🏅', label: 'Hustler',  perk: 'Exclusive AI resource pack (PDFs + cheatsheets)' },
  { min: 5,  emoji: '🚀', label: 'Pro',       perk: '1:1 AI Career Mentorship call (30 min)' },
  { min: 10, emoji: '👑', label: 'Legend',   perk: 'NxtWave Pro subscription — 1 month FREE' },
] as const

export const TRACK_META = [
  { id: 'chatbot',    emoji: '🤖', label: 'AI Chatbot',     desc: 'Build a Gemini-powered chat assistant' },
  { id: 'vision',     emoji: '👁️', label: 'Image AI',       desc: 'Classify & caption images with AI' },
  { id: 'generator',  emoji: '✍️', label: 'Text Generator', desc: 'Generate content, emails & code' },
  { id: 'automation', emoji: '⚡', label: 'Auto-Agent',     desc: 'Chain AI calls into a smart workflow' },
] as const
