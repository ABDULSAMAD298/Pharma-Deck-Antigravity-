'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaymentSuccess() {
  const params = useSearchParams()
  const router = useRouter()
  const plan = params.get('plan')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const planNames: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-10 text-center max-w-md w-full
        border border-slate-700 shadow-2xl">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-400 mb-6">
          Your <span className="text-emerald-400 font-semibold">
            {planNames[plan || ''] || 'Plan'}
          </span> credits have been added to your account.
        </p>
        <div className="bg-emerald-500/10 border border-emerald-500/30 
          rounded-xl p-4 mb-6">
          <p className="text-emerald-400 text-sm">
            ✅ Credits added successfully
          </p>
        </div>
        <p className="text-slate-500 text-sm">
          Redirecting to dashboard in {countdown}s...
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 
            text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  )
}
