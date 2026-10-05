import Link from 'next/link'
import { Home, Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
          <div className="relative w-32 h-32 rounded-full glass flex items-center justify-center border border-indigo-500/20">
            <Frown size={48} className="text-indigo-400 animate-float" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 badge badge-purple mb-4">
          404 · Page Not Found
        </div>

        <h1 className="font-display font-bold text-4xl text-white mb-3">
          Lost in the matrix?
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-8">
          This page doesn&apos;t exist. Maybe the referral code is wrong,
          or the link has expired.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center gap-2 w-auto px-8"
          >
            <Home size={16} />
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  )
}
