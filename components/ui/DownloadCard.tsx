'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Presentation, Table2, RefreshCw, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

interface DownloadCardProps {
    download_url: string
    type: 'presentation' | 'excel'
    topic: string
    fileName?: string
    slidesCount?: number
    rowsCount?: number
    onGenerateAnother?: () => void
}

export default function DownloadCard({
    download_url,
    type,
    topic,
    fileName,
    slidesCount,
    rowsCount,
    onGenerateAnother,
}: DownloadCardProps) {
    useEffect(() => {
        // Confetti on mount
        const runConfetti = async () => {
            try {
                const confetti = (await import('canvas-confetti')).default
                confetti({
                    particleCount: 120,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
                })
            } catch { }
        }
        runConfetti()
    }, [])

    const isPresentation = type === 'presentation'

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-auto"
        >
            {/* Success banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
                <span className="text-2xl">✅</span>
                <div>
                    <p className="text-emerald-400 font-semibold text-sm">
                        {isPresentation ? 'Your Presentation is Ready!' : 'Your Excel Sheet is Ready!'}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                        {isPresentation ? `${slidesCount ?? 10} slides generated` : `${rowsCount ?? 20} rows generated`}
                    </p>
                </div>
            </div>

            {/* Topic */}
            <div className="mb-6">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Topic</p>
                <p className="text-white font-semibold text-sm leading-relaxed line-clamp-2">{topic}</p>
                {fileName && (
                    <p className="text-slate-500 text-xs mt-1">{fileName}</p>
                )}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isPresentation ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                    {isPresentation
                        ? <Presentation className="w-8 h-8 text-emerald-400" />
                        : <Table2 className="w-8 h-8 text-blue-400" />
                    }
                </div>
            </div>

            {/* Download button */}
            <a
                href={download_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-4 text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 mb-4"
            >
                <Download className="w-5 h-5" />
                Download {isPresentation ? 'PowerPoint (.pptx)' : 'Excel Sheet (.xlsx)'}
            </a>

            {/* Secondary actions */}
            <div className="flex gap-3 mt-2">
                {onGenerateAnother && (
                    <button
                        onClick={onGenerateAnother}
                        className="flex-1 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Generate Another
                    </button>
                )}
                <Link
                    href="/dashboard"
                    className="flex-1 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
            </div>
        </motion.div>
    )
}
