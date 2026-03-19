'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Pill, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please fill all fields')
            return
        }
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (error) {
            toast.error(error.message || 'Login failed')
            return
        }
        toast.success('Welcome back! 👋')
        router.push('/dashboard')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex">
            {/* Left — green gradient */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center z-10"
                >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3">PharmaDeck</h2>
                    <p className="text-emerald-100 text-lg font-medium mb-8">Study Smarter. Score Higher.</p>
                    <div className="space-y-3 text-left max-w-xs mx-auto">
                        {['AI-powered presentations', 'Color-coded Excel study sheets', 'Used by 500+ pharmacy students'].map((f) => (
                            <div key={f} className="flex items-center gap-2.5 text-white/90 text-sm">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                {f}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right — white form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Pill className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">PharmaDeck</span>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back!</h1>
                    <p className="text-slate-500 text-sm mb-8">Sign in to your PharmaDeck account</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
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

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Password</label>
                                <button type="button" className="text-emerald-600 text-xs font-medium hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 accent-emerald-500 rounded"
                            />
                            <span className="text-sm text-slate-600">Remember me</span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
                            Sign Up Free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
