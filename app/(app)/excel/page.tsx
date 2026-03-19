'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Table2, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import CreditBadge from '@/components/ui/CreditBadge'
import LoadingAnimation from '@/components/ui/LoadingAnimation'
import DownloadCard from '@/components/ui/DownloadCard'
import PricingModal from '@/components/ui/PricingModal'
import { usePlan } from '@/hooks/usePlan'

const examplePrompts = [
    'Drug interactions table for 15 common cardiovascular drugs',
    'Antibiotic classification with mechanism of action',
    'Antibiotic dosing chart with renal adjustment',
    'Pharmacokinetics parameters comparison table',
    'Clinical pharmacy case study template',
    'Drug brand names vs generic names list',
]

const EXCEL_THEMES = [
    { id: 'auto',    name: 'Auto AI',       tag: 'AI Picks',     preview: ['6366F1','818CF8','EEF2FF'] },
    { id: 'medical', name: 'Medical',       tag: 'Clinical',     preview: ['0F172A','10B981','F0FDF4'] },
    { id: 'blue',    name: 'Ocean Blue',    tag: 'Professional', preview: ['1E3A8A','3B82F6','EFF6FF'] },
    { id: 'purple',  name: 'Academic',      tag: 'Research',     preview: ['4C1D95','8B5CF6','FAF5FF'] },
    { id: 'teal',    name: 'Teal',          tag: 'Modern',       preview: ['134E4A','0F766E','F0FDFA'] },
    { id: 'gold',    name: 'Gold',          tag: 'Premium',      preview: ['0F172A','D97706','FFFBEB'] },
    { id: 'red',     name: 'Anatomy',       tag: 'Bold',         preview: ['7F1D1D','DC2626','FFF5F5'] },
    { id: 'slate',   name: 'Slate',         tag: 'Minimal',      preview: ['1E293B','64748B','F8FAFC'] },
    { id: 'indigo',  name: 'Deep Indigo',   tag: 'Dark',         preview: ['1E1B4B','4F46E5','EEF2FF'] },
    { id: 'emerald', name: 'Emerald',       tag: 'Fresh',        preview: ['064E3B','059669','ECFDF5'] },
    { id: 'black',   name: 'Classic',       tag: 'Traditional',  preview: ['000000','374151','F9FAFB'] },
]

export default function ExcelPage() {
    const router = useRouter()
    const { limits, planName, isFree, isStarter } = usePlan()
    const [prompt, setPrompt] = useState('')
    const [numRows, setNumRows] = useState(20)
    const [colorTheme, setColorTheme] = useState('medical')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ download_url: string; filename: string; rows: number; has_images?: boolean; image_count?: number } | null>(null)
    const [pricingModalOpen, setPricingModalOpen] = useState(false)
    const [error, setError] = useState('')

    async function handleGenerate() {
        if (!prompt.trim()) {
            toast.error('Please enter a topic')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const formData = new FormData()
            formData.append('prompt', prompt)
            formData.append('numRows', numRows.toString())
            formData.append('colorTheme', colorTheme)
            uploadedFiles.forEach(file => formData.append('files', file))

            const res = await fetch('/api/generate-excel', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 402) {
                    setPricingModalOpen(true)
                    return
                }
                if (res.status === 403) {
                    toast.error(data.error)
                    return
                }
                throw new Error(data.error || 'Generation failed')
            }

            setResult(data)
            toast.success(
                data.has_images
                    ? `✅ Excel ready with ${data.image_count} embedded image(s)!`
                    : '✅ Excel sheet is ready!'
            )
        } catch (err: any) {
            const msg = err.message || 'Something went wrong'
            setError(msg)
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const loadingMessages = uploadedFiles.length > 0 
        ? [
            "📄 Reading your files...",
            "🔬 Extracting content...",
            "📊 Building your spreadsheet...",
            "🖼️ Embedding images...",
            "✨ Almost ready...",
        ] : [
            "🤖 Gemini AI is designing your sheet...",
            "📊 Building rows and columns...",
            "🎨 Applying colors...",
            "✨ Almost ready...",
        ]

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8">
            {isLoading && <LoadingAnimation messages={loadingMessages} estimatedSeconds={15} />}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Table2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">AI Excel Sheet Generator</h1>
                            <p className="text-slate-400 text-xs">1 credit per generation</p>
                        </div>
                    </div>
                </div>
                <CreditBadge onBuyClick={() => setPricingModalOpen(true)} />
            </div>

            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl mx-auto">
                            <DownloadCard
                                download_url={result.download_url}
                                type="excel"
                                topic={prompt}
                                fileName={result.filename}
                                rowsCount={result.rows}
                                onGenerateAnother={() => { setResult(null); setPrompt(''); setUploadedFiles([]); setError('') }}
                            />
                            {result.has_images && (
                                <p className="text-center text-sm text-emerald-400 mt-2 font-medium bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
                                    🖼️ {result.image_count} image(s) embedded in "📷 Images" sheet
                                </p>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            {/* Error Header */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
                                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-red-400 text-sm font-medium">{error}. Your credit has been safely auto-refunded.</p>
                                </div>
                            )}

                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
                                {/* Prompt */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Describe Your Excel Sheet <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            rows={5}
                                            placeholder="e.g., Create a drug interactions table for 15 common cardiovascular drugs with columns: Drug Name, Class, Mechanism of Action, Common Interactions, Severity Level, Clinical Notes..."
                                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    {/* File Upload Section */}
                                    <div className="w-full space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-1">
                                                📎 Upload Files <span className="text-slate-500 font-normal">(Optional • Max {limits.maxFiles})</span>
                                            </label>
                                            <p className="text-xs text-slate-500 mb-3">
                                                PDFs, Word docs → AI extracts data into sheet.
                                                Images (PNG/JPG) → AI reads content + embeds images in a separate sheet.
                                            </p>

                                            {limits.fileUpload && (
                                                <p className="text-[10px] text-emerald-400 font-medium mb-1">
                                                    {isStarter 
                                                        ? `⭐ Starter: Max ${limits.maxFiles} files`
                                                        : `🔥 Pro: Max ${limits.maxFiles} files`
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {!limits.fileUpload ? (
                                            <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-6 text-center opacity-70 bg-slate-900/40">
                                                <div className="text-2xl mb-2">🔒</div>
                                                <p className="text-slate-400 text-sm font-medium">File Upload — Starter & Pro Only</p>
                                                <p className="text-slate-500 text-[10px] mt-1">Upload files to include in your analysis</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setPricingModalOpen(true)}
                                                    className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                                >
                                                    Upgrade to Starter →
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <label className={`flex flex-col items-center justify-center w-full h-28
                                                    border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                                                    ${uploadedFiles.length >= limits.maxFiles
                                                        ? 'border-slate-700 opacity-50 cursor-not-allowed'
                                                        : 'border-slate-600 hover:border-emerald-500 hover:bg-slate-800/30'
                                                    }`}>
                                                    <div className="text-center pointer-events-none">
                                                        <div className="text-2xl mb-1">📁</div>
                                                        <p className="text-slate-400 text-sm font-medium">
                                                            {uploadedFiles.length >= limits.maxFiles ? 'Limit reached' : 'Click to upload or drag & drop'}
                                                        </p>
                                                        <p className="text-slate-500 text-[10px] mt-1">
                                                            PDF • PNG • JPG • WEBP (max {limits.maxFiles} files)
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
                                                    <div className="space-y-2 max-w-2xl">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-slate-400 font-medium">
                                                                {uploadedFiles.length}/{limits.maxFiles} files
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => setUploadedFiles([])}
                                                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                            >
                                                                Clear all
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {uploadedFiles.map((file, i) => (
                                                                <div key={i} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <span className="text-lg flex-shrink-0">
                                                                            {file.type.includes('pdf') ? '📄' : file.type.startsWith('image/') ? '🖼️' : '📝'}
                                                                        </span>
                                                                        <div className="min-w-0">
                                                                            <p className="text-white text-[10px] font-medium truncate">{file.name}</p>
                                                                            <p className="text-slate-400 text-[10px]">{(file.size / 1024).toFixed(0)} KB</p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                                        className="text-slate-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0 text-lg leading-none"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Examples */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Quick Examples</p>
                                    <div className="flex flex-wrap gap-2">
                                        {examplePrompts.map((ex) => (
                                            <button
                                                key={ex}
                                                onClick={() => setPrompt(ex)}
                                                className="text-xs bg-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 text-slate-300 border border-slate-600 rounded-lg px-3 py-1.5 transition-all duration-200"
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rows and Theme */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                                    <div className="lg:col-span-3">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Rows</label>
                                        <input
                                            type="number"
                                            min={5}
                                            max={100}
                                            value={numRows}
                                            onChange={(e) => setNumRows(Math.max(5, Math.min(100, Number(e.target.value))))}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        />
                                        <p className="text-slate-500 text-[10px] mt-1">Min: 5 · Max: 100</p>
                                    </div>

                                    <div className="lg:col-span-9">
                                        <div className="w-full">
                                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                                🎨 Color Theme
                                            </label>
                                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
                                                {EXCEL_THEMES.map((theme) => {
                                                    const isSelected = colorTheme === theme.id
                                                    return (
                                                        <button
                                                            key={theme.id}
                                                            type="button"
                                                            onClick={() => setColorTheme(theme.id)}
                                                            className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                                                                isSelected
                                                                ? 'border-emerald-400 ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 scale-105'
                                                                : 'border-slate-700 hover:border-slate-500'
                                                            }`}
                                                        >
                                                            <div className="h-10 flex">
                                                                {theme.preview.map((color, i) => (
                                                                    <div key={i} className="flex-1" style={{ backgroundColor: `#${color}` }} />
                                                                ))}
                                                            </div>
                                                            <div className="bg-slate-800 py-1.5 px-1 text-center">
                                                                <p className="text-white text-[9px] font-semibold leading-tight truncate">{theme.name}</p>
                                                                <p className="text-slate-400 text-[8px] leading-tight">{theme.tag}</p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-1 right-1 bg-emerald-400 rounded-full w-4 h-4 flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generate */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 text-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                                >
                                    <Zap className="w-6 h-6" />
                                    ⚡ Generate Professional Excel (1 credit)
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
