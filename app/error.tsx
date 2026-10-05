'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping" />
          <div className="relative w-28 h-28 rounded-full glass flex items-center justify-center border border-rose-500/20">
            <AlertTriangle size={44} className="text-rose-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 badge badge-orange mb-4">
          Something went wrong
        </div>

        <h2 className="font-display font-bold text-3xl text-white mb-3">
          Unexpected Error
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {error.digest && (
          <p className="text-slate-600 text-xs mb-8 font-mono">
            Digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center justify-center gap-2 w-auto px-8"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <a
            href="/"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Home size={15} />
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
