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

const examplePrompts = [
    'Drug interactions table for 15 common cardiovascular drugs',
    'Antibiotic classification with mechanism of action',
    'Antibiotic dosing chart with renal adjustment',
    'Pharmacokinetics parameters comparison table',
    'Clinical pharmacy case study template',
    'Drug brand names vs generic names list',
]

const colorThemes = [
    { id: 'default', label: '⚪ Default (No Color)', header: '#FFFFFF', alt: '#FFFFFF' },
    { id: 'green', label: '🟢 Medical Green', header: '#0F172A', alt: '#F0FDF4' },
    { id: 'blue', label: '🔵 Professional Blue', header: '#1E3A8A', alt: '#EFF6FF' },
    { id: 'purple', label: '🟣 Academic Purple', header: '#4C1D95', alt: '#F5F3FF' },
    { id: 'black', label: '⚫ Classic Black', header: '#000000', alt: '#F9FAFB' },
    { id: 'rose', label: '🔴 Rose Pink', header: '#BE123C', alt: '#FFF1F2' },
    { id: 'teal', label: '💧 Oceanic Teal', header: '#0F766E', alt: '#F0FDFA' },
]

const loadingMessages = [
    '🤖 Gemini AI is analyzing your request...',
    '📊 Generating pharmacy data...',
    '🎨 Applying color theme...',
    '✨ Building your spreadsheet...',
]

export default function ExcelPage() {
    const router = useRouter()
    const [prompt, setPrompt] = useState('')
    const [numRows, setNumRows] = useState(20)
    const [colorTheme, setColorTheme] = useState('default')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ download_url: string; filename: string; rows: number } | null>(null)
    const [previewRows, setPreviewRows] = useState<string[][]>([])
    const [previewHeaders, setPreviewHeaders] = useState<string[]>([])
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!prompt.trim()) { toast.error('Please describe your Excel sheet'); return }

        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/generate-excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, num_rows: numRows, color_theme: colorTheme }),
            })
            const data = await res.json()

            if (res.status === 402) {
                setLoading(false)
                toast.error('No credits remaining.')
                return
            }
            if (!res.ok) throw new Error(data.error || 'Generation failed')

            setResult({ download_url: data.download_url, filename: data.filename, rows: numRows })
            if (data.preview_headers) setPreviewHeaders(data.preview_headers)
            if (data.preview_rows) setPreviewRows(data.preview_rows)
            toast.success('Excel sheet generated! 🎉')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Generation failed'
            setError(msg)
            toast.error('Generation failed. Your credit has been safely auto-refunded.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8">
            {loading && <LoadingAnimation messages={loadingMessages} estimatedSeconds={12} subtitle="Gemini AI is crafting your spreadsheet. Usually under 10 seconds." />}

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
                <CreditBadge onBuyClick={() => router.push('/pricing')} />
            </div>

            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <DownloadCard
                                download_url={result.download_url}
                                type="excel"
                                topic={prompt}
                                fileName={result.filename}
                                rowsCount={result.rows}
                                onGenerateAnother={() => { setResult(null); setPrompt(''); setError('') }}
                            />

                            {/* Preview table */}
                            {previewHeaders.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 overflow-x-auto"
                                >
                                    <p className="text-sm font-semibold text-slate-300 mb-3">Preview (first 3 rows)</p>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr>
                                                {previewHeaders.map((h, i) => (
                                                    <th key={i} className="bg-emerald-900/50 text-emerald-300 px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewRows.slice(0, 3).map((row, ri) => (
                                                <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-700/30' : ''}>
                                                    {row.map((cell, ci) => (
                                                        <td key={ci} className="px-3 py-2 text-slate-300 whitespace-nowrap max-w-xs truncate">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
                                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-red-400 text-sm">{error}. Your credit has been safely auto-refunded.</p>
                                </div>
                            )}

                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
                                {/* Prompt */}
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

                                {/* Example prompts */}
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

                                {/* Rows */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Rows</label>
                                    <input
                                        type="number"
                                        min={5}
                                        max={100}
                                        value={numRows}
                                        onChange={(e) => setNumRows(Math.max(5, Math.min(100, Number(e.target.value))))}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-slate-500 text-xs mt-1">Min: 5 rows · Max: 100 rows</p>
                                </div>

                                {/* Color theme */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Color Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {colorThemes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setColorTheme(theme.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${colorTheme === theme.id
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                                    }`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <div className={`h-2.5 w-8 rounded-sm ${theme.id === 'default' ? 'border border-slate-300' : ''}`} style={{ backgroundColor: theme.header }} />
                                                    <div className={`h-2 w-8 rounded-sm ${theme.id === 'default' ? 'border border-slate-300' : ''}`} style={{ backgroundColor: theme.alt }} />
                                                </div>
                                                {theme.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt.trim()}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                                >
                                    <Zap className="w-5 h-5" />
                                    ⚡ Generate Excel Sheet (1 credit)
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
