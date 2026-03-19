'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface PricingPlan {
    id: string
    name: string
    price: string
    priceNum: number
    subtitle: string
    credits: number
    features: string[]
    badge?: string
    badgeColor?: string
    highlight?: boolean
    dark?: boolean
}

const plans: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 'Rs. 0',
        priceNum: 0,
        subtitle: 'Forever free • No card required',
        credits: 2,
        features: [
            '2 AI Presentations',
            'Instant .pptx download',
            'Instant .xlsx download',
            'Professional quality output',
        ],
    },
    {
        id: 'starter',
        name: 'Starter',
        price: 'Rs. 2,100',
        priceNum: 2100,
        subtitle: '5 credits • Best for assignments',
        credits: 5,
        badge: '⭐ Most Popular',
        badgeColor: 'bg-emerald-500',
        highlight: true,
        features: [
            '5 AI Presentations',
            'or 5 AI Excel Sheets',
            'Mix & match any combination',
            'Instant download (.pptx & .xlsx)',
            'Generation history',
            'Professional designs',
            'Priority support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 'Rs. 5,250',
        priceNum: 5250,
        subtitle: '15 credits • Save 17%',
        credits: 15,
        badge: '🔥 Best Value',
        badgeColor: 'bg-amber-500',
        dark: true,
        features: [
            '15 AI Presentations',
            'or 15 AI excel sheets',
            'Mix & match any combination',
            'Instant download (.pptx & .xlsx)',
            'Full generation history',
            'Priority generation (faster)',
            'Professional designs',
            'Dedicated email support',
        ],
    },
]

interface PricingCardProps {
    plan: PricingPlan
    onBuy?: (plan: PricingPlan) => void
    index?: number
}

export function PricingCard({ plan, onBuy, index = 0 }: PricingCardProps) {
    const isFree = plan.id === 'free'

    const cardClass = plan.dark
        ? 'bg-[#0F172A] border border-[#334155]'
        : plan.highlight
            ? 'bg-white border-2 border-[#10B981] scale-105 shadow-xl shadow-emerald-500/10'
            : 'bg-white border border-[#E2E8F0] shadow-sm'

    const nameColor = plan.dark ? 'text-white' : 'text-slate-900'
    const priceColor = plan.dark ? 'text-white' : 'text-slate-900'
    const subtitleColor = plan.dark ? 'text-slate-400' : 'text-slate-500'
    const featureColor = plan.dark ? 'text-slate-300' : 'text-slate-700'

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative rounded-2xl p-8 flex flex-col ${cardClass}`}
        >
            {/* Badge */}
            {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${plan.badgeColor} text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap`}>
                    {plan.badge}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${nameColor}`}>{plan.name}</h3>
                <div className={`text-4xl font-black mb-1 ${priceColor}`}>{plan.price}</div>
                <p className={`text-sm ${subtitleColor}`}>{plan.subtitle}</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className={`text-sm ${featureColor}`}>{f}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            {isFree ? (
                <button
                    onClick={() => onBuy?.(plan)}
                    className="w-full border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200"
                >
                    Get Started Free
                </button>
            ) : (
                <button
                    onClick={() => onBuy?.(plan)}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Zap className="w-4 h-4" />
                    Buy {plan.name}
                </button>
            )}
        </motion.div>
    )
}

// Export plans for reuse
export { plans }

// Default export: full section of 3 cards
export default function PricingSection({ onBuy }: { onBuy?: (plan: PricingPlan) => void }) {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {plans.map((plan, i) => (
                    <PricingCard key={plan.id} plan={plan} onBuy={onBuy} index={i} />
                ))}
            </div>

            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Secure Payments via Safepay</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Credits Never Expire</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>🇵🇰</span>
                    <span>Made for Pakistani Students</span>
                </div>
            </div>
        </div>
    )
}
