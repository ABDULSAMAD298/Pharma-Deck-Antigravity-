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
import ThemeSelector from '@/components/ThemeSelector'
import PricingModal from '@/components/ui/PricingModal'
import { usePlan } from '@/hooks/usePlan'

const loadingMessages = [
    '🔍 Analyzing your topic...',
    '📝 Creating slide content...',
    '🎨 Designing layouts...',
    '✨ Polishing your presentation...',
    '📦 Almost ready...',
]

export default function PresentationPage() {
    const router = useRouter()
    const { limits, planName, isFree } = usePlan()
    const [topic, setTopic] = useState('')
    const [numSlides, setNumSlides] = useState(10)
    const [templateId, setTemplateId] = useState('d057960b-19c7-4770-bfda-ca5277a1ff6e')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ download_url: string; presentation_id: string } | null>(null)
    const [error, setError] = useState('')
    const [pricingModalOpen, setPricingModalOpen] = useState(false)

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error('Please enter a topic'); return }
        if (topic.length > 2000) { toast.error('Topic too long (max 2000 chars)'); return }

        setLoading(true)
        setError('')
        try {
            const formData = new FormData()
            formData.append('topic', topic)
            formData.append('num_slides', numSlides.toString())
            formData.append('template_id', templateId)
            formData.append('language', 'en')
            uploadedFiles.forEach(file => formData.append('files', file))

            const res = await fetch('/api/generate-presentation', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()

            if (res.status === 402) {
                setLoading(false)
                setPricingModalOpen(true)
                return
            }
            if (res.status === 403) {
                setLoading(false)
                toast.error(data.error)
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
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setResult(null)
        setTopic('')
        setUploadedFiles([])
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
                <CreditBadge onBuyClick={() => setPricingModalOpen(true)} />
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
                                <div className="space-y-4">
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

                                    {/* File Upload Section */}
                                    {!limits.fileUpload ? (
                                        <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-6 text-center opacity-60">
                                            <div className="text-3xl mb-2">🔒</div>
                                            <p className="text-slate-400 text-sm font-medium">File Upload — Starter & Pro Only</p>
                                            <p className="text-slate-500 text-xs mt-1">Upload PDFs and images to include in your presentation</p>
                                            <button
                                                type="button"
                                                onClick={() => setPricingModalOpen(true)}
                                                className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                            >
                                                Upgrade to Starter →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-slate-300 mb-1">
                                                📎 Upload Files <span className="text-slate-500 font-normal">(Optional • Max {limits.maxFiles})</span>
                                            </label>
                                            <label className={`flex flex-col items-center justify-center w-full h-24
                                                border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                                                ${uploadedFiles.length >= limits.maxFiles
                                                    ? 'border-slate-700 opacity-50 cursor-not-allowed'
                                                    : 'border-slate-600 hover:border-emerald-500 hover:bg-slate-800/30'
                                                }`}>
                                                <div className="text-center pointer-events-none">
                                                    <p className="text-slate-400 text-sm font-medium">
                                                        {uploadedFiles.length >= limits.maxFiles ? 'Max files reached' : 'Click to upload or drag & drop'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    multiple
                                                    disabled={uploadedFiles.length >= limits.maxFiles}
                                                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                                                    onChange={(e) => {
                                                        const newFiles = Array.from(e.target.files || [])
                                                        setUploadedFiles(prev => {
                                                            const combined = [...prev, ...newFiles]
                                                            return combined.slice(0, limits.maxFiles)
                                                        })
                                                        e.target.value = ''
                                                    }}
                                                />
                                            </label>
                                            {uploadedFiles.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {uploadedFiles.map((file, i) => (
                                                        <div key={i} className="bg-slate-700/50 rounded-lg px-2 py-1 flex items-center gap-2 border border-slate-600">
                                                            <span className="text-slate-200 text-[10px] truncate max-w-[100px]">{file.name}</span>
                                                            <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-400 text-xs">×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Slides slider */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                                        Number of Slides: <span className="text-emerald-400">{numSlides} slides</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={5}
                                        max={limits.maxSlides}
                                        value={numSlides}
                                        onChange={(e) => setNumSlides(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Max {limits.maxSlides} slides on {planName} plan
                                        {isFree && (
                                            <button onClick={() => setPricingModalOpen(true)} className="ml-2 text-emerald-400 hover:underline">
                                                Upgrade for more →
                                            </button>
                                        )}
                                    </p>
                                </div>

                                 {/* Theme Selector */}
                                <ThemeSelector 
                                    selectedId={templateId} 
                                    onSelect={setTemplateId} 
                                />

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
            <PricingModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />
        </div>
    )
}
