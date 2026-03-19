'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PricingSection, { type PricingPlan } from '@/components/ui/PricingCard'

const faqs = [
    {
        q: 'What is a credit?',
        a: '1 credit = 1 Presentation OR 1 Excel Sheet. Use them in any combination you like.',
    },
    {
        q: 'Do credits expire?',
        a: 'Never. Your credits stay until you use them. Buy once, use whenever you need.',
    },
    {
        q: 'Can I get a refund?',
        a: 'If generation fails, your credit is automatically restored. Contact support@pharmadeck.pk for assistance.',
    },
    {
        q: 'What payment methods are accepted?',
        a: 'Debit card, credit card, EasyPaisa and JazzCash via Safepay — Pakistan\'s trusted gateway.',
    },
    {
        q: 'How long does generation take?',
        a: 'Presentations: 30–60 seconds. Excel sheets: under 10 seconds.',
    },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
        >
            <button
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(!open)}
            >
                <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
                {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-6 py-4 bg-white border-t border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
                </div>
            )}
        </motion.div>
    )
}

export default function PricingPage() {
    const router = useRouter()

    const handleBuy = async (plan: PricingPlan) => {
        if (plan.id === 'free') {
            router.push('/signup')
            return
        }
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, amount: plan.priceNum, credits: plan.credits, planName: plan.name }),
            })
            const data = await res.json()
            if (data.redirect_url) window.location.href = data.redirect_url
        } catch {
            router.push('/signup')
        }
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Header */}
                <div className="text-center mb-14 px-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        💳 Pricing
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                        Simple, Affordable Pricing
                    </h1>
                    <p className="text-slate-600 text-base max-w-md mx-auto">
                        No subscriptions. No hidden fees.<br />
                        Start free, pay only when you need more.
                    </p>
                </div>

                {/* Plans */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <PricingSection onBuy={handleBuy} />
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <FAQItem key={i} q={f.q} a={f.a} index={i} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
