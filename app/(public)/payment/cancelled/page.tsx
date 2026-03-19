'use client'
import { useRouter } from 'next/navigation'

export default function PaymentCancelled() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-10 text-center max-w-md w-full
        border border-slate-700">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
        <p className="text-slate-400 mb-6">
          No charge was made to your account.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 
            text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
