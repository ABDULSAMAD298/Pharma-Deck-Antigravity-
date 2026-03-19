'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PricingSection, { type PricingPlan } from './PricingCard'
import { useRouter } from 'next/navigation'

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const router = useRouter()

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const handleBuy = async (plan: PricingPlan) => {
        if (plan.id === 'free') {
            router.push('/signup')
            onClose()
            return
        }
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, amount: plan.priceNum, credits: plan.credits, planName: plan.name }),
            })
            const data = await res.json()
            if (data.redirect_url) {
                window.location.href = data.redirect_url
            }
        } catch {
            router.push('/pricing')
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-[#F8FAFC] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Upgrade Your Credits</h2>
                                <p className="text-slate-500 text-sm mt-0.5">1 credit = 1 Presentation OR 1 Excel Sheet</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Plans */}
                        <div className="p-6">
                            <PricingSection onBuy={handleBuy} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
