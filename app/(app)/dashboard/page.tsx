'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Presentation, Table2, Zap, Clock, Download,
    ArrowUpRight, BarChart3, FileText, TrendingUp
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CreditBadge from '@/components/ui/CreditBadge'
import PricingModal from '@/components/ui/PricingModal'

interface Stats {
    presentations: number
    excels: number
    creditsRemaining: number
    creditsUsed: number
}

interface Generation {
    id: string
    type: 'presentation' | 'excel'
    topic: string
    status: string
    download_url: string | null
    created_at: string
    slides_count: number | null
}

export default function DashboardPage() {
    const supabase = createClient()
    const router = useRouter()
    const [userName, setUserName] = useState('')
    const [stats, setStats] = useState<Stats>({ presentations: 0, excels: 0, creditsRemaining: 0, creditsUsed: 0 })
    const [generations, setGenerations] = useState<Generation[]>([])
    const [loading, setLoading] = useState(true)
    const [pricingOpen, setPricingOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
            if (profile?.full_name) {
                setUserName(profile.full_name.split(' ')[0])
            }

            const { data: credits } = await supabase.from('credits').select('*').eq('user_id', user.id).single()
            const { data: gens } = await supabase.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)

            const pCount = gens?.filter((g: Generation) => g.type === 'presentation').length ?? 0
            const eCount = gens?.filter((g: Generation) => g.type === 'excel').length ?? 0

            setStats({
                presentations: pCount,
                excels: eCount,
                creditsRemaining: (credits?.total_credits ?? 0) - (credits?.used_credits ?? 0),
                creditsUsed: credits?.used_credits ?? 0,
            })
            setGenerations(gens ?? [])
            setLoading(false)
        }
        fetchData()
    }, [])

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        Welcome back, {userName || 'Student'} 👋
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Here's your PharmaDeck overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <CreditBadge onBuyClick={() => setPricingOpen(true)} />
                    <button
                        onClick={() => setPricingOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl px-3 sm:px-4 py-2 transition-all duration-200 flex items-center gap-1.5"
                    >
                        <Zap className="w-3.5 h-3.5" /> Buy Credits
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Presentations', value: stats.presentations, icon: Presentation, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Excel Sheets', value: stats.excels, icon: Table2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Credits Left', value: stats.creditsRemaining, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Credits Used', value: stats.creditsUsed, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
                    >
                        <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                        </div>
                        <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
                        <div className="text-slate-400 text-xs">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Presentation card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors duration-300"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                        <Presentation className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">AI Presentation Generator</h3>
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                        Create professional PowerPoint presentations instantly from any pharmacy topic.
                    </p>
                    <p className="text-emerald-400 text-xs font-semibold mb-5">⚡ 1 credit = Rs. 840 value</p>
                    <Link
                        href="/presentation"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                    >
                        Generate Now <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Excel card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors duration-300"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                        <Table2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">AI Excel Sheet Generator</h3>
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                        Create color-coded study spreadsheets for drugs, pharmacokinetics, and more.
                    </p>
                    <p className="text-blue-400 text-xs font-semibold mb-5">⚡ 1 credit = Rs. 300 value</p>
                    <Link
                        href="/excel"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all duration-200"
                    >
                        Generate Now <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>

            {/* Recent history */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl"
            >
                <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" /> Recent Generations
                    </h3>
                    <span className="text-slate-500 text-xs">{generations.length} items</span>
                </div>

                {generations.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-semibold">No generations yet</p>
                        <p className="text-slate-500 text-sm mt-1">Create your first presentation or Excel sheet!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3 text-left">Type</th>
                                    <th className="px-5 py-3 text-left">Topic</th>
                                    <th className="px-5 py-3 text-left hidden md:table-cell">Date</th>
                                    <th className="px-5 py-3 text-left hidden sm:table-cell">Status</th>
                                    <th className="px-5 py-3 text-left">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {generations.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${g.type === 'presentation' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {g.type === 'presentation' ? <Presentation className="w-3 h-3" /> : <Table2 className="w-3 h-3" />}
                                                {g.type === 'presentation' ? 'Slides' : 'Excel'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-slate-200 text-sm line-clamp-1 max-w-xs">{g.topic}</span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <span className="text-slate-400 text-xs">{formatDate(g.created_at)}</span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden sm:table-cell">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {g.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {g.download_url ? (
                                                <a
                                                    href={g.download_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                                                >
                                                    <Download className="w-3 h-3" /> Download
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-500 px-3 py-1.5">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
    )
}
