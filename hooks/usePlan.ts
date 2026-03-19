'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getPlanLimits, PlanLimits } from '@/lib/plans'

export function usePlan() {
  const supabase = createClientComponentClient()
  const [planName, setPlanName] = useState<string>('free')
  const [limits, setLimits] = useState<PlanLimits>(getPlanLimits('free'))
  const [credits, setCredits] = useState({ total: 0, used: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlan() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('credits')
        .select('total_credits, used_credits, plan_name')
        .eq('user_id', user.id)
        .single()

      if (data) {
        const plan = (data.plan_name || 'free') as string
        setPlanName(plan)
        setLimits(getPlanLimits(plan))
        setCredits({ total: data.total_credits, used: data.used_credits })
      }
      setLoading(false)
    }
    fetchPlan()
  }, [])

  return {
    planName,
    limits,
    credits,
    remaining: credits.total - credits.used,
    loading,
    isFree: planName === 'free',
    isStarter: planName === 'starter',
    isPro: planName === 'pro',
  }
}
