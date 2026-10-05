const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL   = 'deepseek/deepseek-chat'

interface Message {
  role:    'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterResponse {
  id:      string
  choices: Array<{ message: Message; finish_reason: string }>
  usage:   { prompt_tokens: number; completion_tokens: number; total_tokens: number }
}

async function chat(
  messages: Message[],
  model = DEFAULT_MODEL,
  maxTokens = 512
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization:    `Bearer ${apiKey}`,
      'Content-Type':   'application/json',
      'HTTP-Referer':   process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title':        'NxtWave AI Workshop',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens:   maxTokens,
      temperature:  0.8,
      top_p:        0.95,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter API error ${res.status}: ${err}`)
  }

  const data: OpenRouterResponse = await res.json()
  return data.choices[0]?.message?.content ?? ''
}

/**
 * Generates a personalized welcome message for a new registrant.
 * Called after successful DB insert; result stored back in DB.
 */
export async function generateWelcomeMessage(params: {
  name:    string
  college: string
  track:   string
  year:    string
}): Promise<string> {
  const trackMap: Record<string, string> = {
    chatbot:    'building an AI chatbot',
    vision:     'building an image AI classifier',
    generator:  'building an AI text generator',
    automation: 'building an AI automation agent',
  }
  const trackDesc = trackMap[params.track] ?? 'building an AI project'

  const messages: Message[] = [
    {
      role: 'system',
      content:
        'You are an enthusiastic AI workshop host at NxtWave. '
        + 'Write short, punchy, personalized welcome messages for students. '
        + '2-3 sentences max. No emojis in the first sentence. Be genuine, hype them up, reference their college and track. '
        + 'Do NOT mention any company name other than NxtWave. Do NOT include any HTML.',
    },
    {
      role: 'user',
      content:
        `Write a welcome message for ${params.name}, a ${params.year} student from ${params.college} `
        + `who registered for our "Build Your First AI Project in 60 Minutes" workshop. `
        + `They chose the track: ${trackDesc}. Excite them about what they'll build.`,
    },
  ]

  try {
    return await chat(messages, DEFAULT_MODEL, 180)
  } catch (err) {
    console.error('[OpenRouter] Failed to generate welcome message:', err)
    // Graceful fallback — don't block registration
    return `Welcome to the workshop, ${params.name}! We're pumped to have you with us. Get ready to ship your first AI project tonight! 🚀`
  }
}

/**
 * Generates a personalized referral invite message for sharing.
 */
export async function generateReferralMessage(params: {
  name:        string
  referralUrl: string
  track:       string
}): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content:
        'You are a viral growth copywriter for a tech education platform. '
        + 'Write a 2-sentence WhatsApp-friendly invite message that a student can send to friends. '
        + 'Make it casual, exciting, and include the referral link at the end. No hashtags.',
    },
    {
      role: 'user',
      content:
        `Write a WhatsApp invite message from ${params.name} for the "Build Your First AI Project in 60 Minutes" free workshop. `
        + `Include this link: ${params.referralUrl}`,
    },
  ]

  try {
    return await chat(messages, DEFAULT_MODEL, 120)
  } catch {
    return `Hey! I just signed up for this FREE workshop where we'll build a real AI project in 60 minutes. You should join too! ${params.referralUrl}`
  }
}
