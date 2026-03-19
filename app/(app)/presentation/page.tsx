'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Presentation, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import CreditBadge from '@/components/ui/CreditBadge'
import LoadingAnimation from '@/components/ui/LoadingAnimation'
import DownloadCard from '@/components/ui/DownloadCard'

const loadingMessages = [
    '🔍 Analyzing your topic...',
    '📝 Creating slide content...',
    '🎨 Designing layouts...',
    '✨ Polishing your presentation...',
    '📦 Almost ready...',
]

export default function PresentationPage() {
    const router = useRouter()
    const [topic, setTopic] = useState('')
    const [numSlides, setNumSlides] = useState(10)
    const [language, setLanguage] = useState('en')
    const [templateId, setTemplateId] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ download_url: string; presentation_id: string } | null>(null)
    const [creditsLeft, setCreditsLeft] = useState<number | null>(null)
    const [showPricing, setShowPricing] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error('Please enter a topic'); return }
        if (topic.length > 2000) { toast.error('Topic too long (max 2000 chars)'); return }

        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/generate-presentation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, num_slides: numSlides, language, template_id: templateId || undefined }),
            })
            const data = await res.json()

            if (res.status === 402) {
                setLoading(false)
                toast.error('No credits remaining. Please buy more credits.')
                return
            }
            if (!res.ok) {
                throw new Error(data.error || 'Generation failed')
            }

            setResult({ download_url: data.download_url, presentation_id: data.presentation_id })
            toast.success('Presentation generated! 🎉')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Generation failed'
            setError(msg)
            toast.error('Generation failed. Your credit has been safely auto-refunded.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setResult(null)
        setTopic('')
        setError('')
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8">
            {loading && <LoadingAnimation messages={loadingMessages} estimatedSeconds={50} />}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <Presentation className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">AI Presentation Generator</h1>
                            <p className="text-slate-400 text-xs">1 credit per generation</p>
                        </div>
                    </div>
                </div>
                <CreditBadge onBuyClick={() => router.push('/pricing')} />
            </div>

            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <DownloadCard
                                download_url={result.download_url}
                                type="presentation"
                                topic={topic}
                                slidesCount={numSlides}
                                onGenerateAnother={handleReset}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
                                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-400 text-sm font-semibold">Generation failed</p>
                                        <p className="text-red-300 text-xs mt-0.5">{error}</p>
                                        <p className="text-slate-400 text-xs mt-1">Don't worry, your credit has been safely auto-refunded.</p>
                                    </div>
                                </div>
                            )}

                            {/* Form card */}
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
                                {/* Topic */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                                        Presentation Topic <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        rows={4}
                                        maxLength={2000}
                                        placeholder="e.g., Mechanisms of Antibiotics, Drug-Drug Interactions, Pharmacokinetics of Beta-blockers..."
                                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                    />
                                    <div className="flex items-center justify-between mt-1.5">
                                        <p className="text-slate-500 text-xs">Be specific for better results. You can paste your notes too.</p>
                                        <span className={`text-xs ${topic.length > 1800 ? 'text-red-400' : 'text-slate-500'}`}>{topic.length}/2000</span>
                                    </div>
                                </div>

                                {/* Slides slider */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                                        Number of Slides: <span className="text-emerald-400">{numSlides} slides</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={5}
                                        max={20}
                                        value={numSlides}
                                        onChange={(e) => setNumSlides(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        {[5, 10, 15, 20].map((n) => <span key={n}>{n}</span>)}
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Language</label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 'en', label: '🇺🇸 English' },
                                            { value: 'ur', label: '🌐 Urdu' },
                                        ].map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => setLanguage(lang.value)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${language === lang.value
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Template ID */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Template ID (optional)</label>
                                    <input
                                        type="text"
                                        value={templateId}
                                        onChange={(e) => setTemplateId(e.target.value)}
                                        placeholder="Leave blank for AI auto-selection"
                                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-slate-500 text-xs mt-1">Leave blank for AI to auto-select the best design.</p>
                                </div>

                                {/* Generate button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                                >
                                    <Zap className="w-5 h-5" />
                                    ⚡ Generate Presentation (1 credit)
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
