import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Build Your First AI Project in 60 Minutes | NxtWave',
  description:
    'Go from zero to shipping a working AI-powered app in one live session. Free, hands-on, built for university students.',
  keywords: ['AI workshop', 'NxtWave', 'Gemini API', 'DeepSeek', 'AI project', 'free workshop', 'coding'],
  authors: [{ name: 'NxtWave' }],
  openGraph: {
    title: 'Build Your First AI Project in 60 Minutes',
    description: 'Free live workshop — ship a real AI project tonight.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Your First AI Project in 60 Minutes | NxtWave',
    description: 'Free live workshop — ship a real AI project tonight.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050714',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="bg-mesh" aria-hidden />
        <div className="bg-grid"  aria-hidden />
        <main className="relative z-10">{children}</main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(15,15,30,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '12px',
              padding: '12px 20px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#050714' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#050714' } },
          }}
        />
      </body>
    </html>
  )
}
