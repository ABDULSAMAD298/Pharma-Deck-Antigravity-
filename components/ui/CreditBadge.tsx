'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CreditBadgeProps {
    onBuyClick?: () => void
    compact?: boolean
}

export default function CreditBadge({ onBuyClick, compact = false }: CreditBadgeProps) {
    const [credits, setCredits] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('credits')
                .select('total_credits, used_credits')
                .eq('user_id', user.id)
                .single() as { data: { total_credits: number, used_credits: number } | null }

            if (data) {
                setCredits(data.total_credits - data.used_credits)
            }
            setLoading(false)
        }

        fetchCredits()
    }, [])

    const getColor = (n: number) => {
        if (n > 3) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        if (n >= 2) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
        return 'bg-red-500/10 text-red-400 border-red-500/30'
    }

    if (loading) {
        return <div className="h-8 w-24 bg-slate-700 rounded-full animate-pulse" />
    }

    const available = credits ?? 0
    const colorClass = getColor(available)

    return (
        <button
            onClick={onBuyClick}
            className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:scale-105 ${colorClass} ${compact ? 'text-xs px-2.5 py-1' : ''}`}
        >
            <Zap className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
            <span>{available} {compact ? '' : 'credits'}</span>
        </button>
    )
}
