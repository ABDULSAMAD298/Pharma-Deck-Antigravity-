'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingAnimationProps {
    messages?: string[]
    subtitle?: string
    estimatedSeconds?: number
}

const defaultMessages = [
    '🔍 Analyzing your topic...',
    '📝 Creating content...',
    '🎨 Designing layouts...',
    '✨ Polishing results...',
    '📦 Almost ready...',
]

export default function LoadingAnimation({
    messages = defaultMessages,
    subtitle = "This usually takes 30–60 seconds. Please don't close this page.",
    estimatedSeconds = 45,
}: LoadingAnimationProps) {
    const [msgIndex, setMsgIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const msgInterval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length)
        }, 4000)
        return () => clearInterval(msgInterval)
    }, [messages.length])

    useEffect(() => {
        const totalMs = estimatedSeconds * 1000
        const step = 100 / (totalMs / 100)
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + step, 95))
        }, 100)
        return () => clearInterval(progressInterval)
    }, [estimatedSeconds])

    return (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center"
            >
                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-3 border-4 border-slate-600 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                    </div>
                </div>

                {/* Message */}
                <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-white font-semibold text-lg mb-2"
                >
                    {messages[msgIndex]}
                </motion.p>
                <p className="text-slate-400 text-sm mb-6">{subtitle}</p>

                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
                <p className="text-slate-500 text-xs mt-2">{Math.round(progress)}% complete</p>
            </motion.div>
        </div>
    )
}
