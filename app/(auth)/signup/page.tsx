'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Pill, ArrowRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName || !email || !password || !confirmPw) {
            toast.error('Please fill all fields')
            return
        }
        if (password !== confirmPw) {
            toast.error('Passwords do not match')
            return
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (!termsAccepted) {
            toast.error('Please accept the terms of service')
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            },
        })
        setLoading(false)

        if (error) {
            toast.error(error.message || 'Sign up failed')
            return
        }

        toast.success('Welcome to PharmaDeck! 2 free credits added 🎉', { duration: 5000 })
        router.push('/dashboard')
        router.refresh()
    }

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
    const strengthLabels = ['', 'Weak', 'Good', 'Strong']
    const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-emerald-500']

    return (
        <div className="min-h-screen flex">
            {/* Left */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center z-10"
                >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3">Join PharmaDeck</h2>
                    <p className="text-emerald-100 text-lg font-medium mb-8">Get 2 free credits instantly</p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left max-w-xs mx-auto">
                        <p className="text-white font-semibold text-sm mb-3">Free plan includes:</p>
                        {['2 AI Presentations (no card)', '2 AI Excel Study Sheets', 'Instant .pptx & .xlsx download', 'Professional pharmacy content'].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-white/90 text-sm mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                                {f}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md py-6"
                >
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Pill className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">PharmaDeck</span>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 mb-1">Create your account</h1>
                    <p className="text-slate-500 text-sm mb-8">Get 2 free credits — no card required</p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Muhammad Ahmed"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@university.edu"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3].map((v) => (
                                            <div key={v} className={`h-1 flex-1 rounded-full transition-colors ${strength >= v ? strengthColors[strength] : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500">{strengthLabels[strength]}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                                placeholder="Re-enter password"
                                className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${confirmPw && confirmPw !== password ? 'border-red-300' : 'border-slate-200'}`}
                                required
                            />
                            {confirmPw && confirmPw !== password && (
                                <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                            )}
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 accent-emerald-500 rounded mt-0.5"
                            />
                            <span className="text-sm text-slate-600">
                                I agree to the{' '}
                                <span className="text-emerald-600 font-semibold">Terms of Service</span>{' '}
                                and{' '}
                                <span className="text-emerald-600 font-semibold">Privacy Policy</span>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
