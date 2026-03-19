export type PlanName = 'free' | 'starter' | 'pro'

export interface PlanLimits {
  maxSlides: number
  fileUpload: boolean
  maxFiles: number
  maxImages: number
  fullHistory: boolean
  creditsOnSignup: number
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    maxSlides: 10,
    fileUpload: false,
    maxFiles: 0,
    maxImages: 0,
    fullHistory: false,
    creditsOnSignup: 2,
  },
  starter: {
    maxSlides: 15,
    fileUpload: true,
    maxFiles: 3,
    maxImages: 3,
    fullHistory: false,
    creditsOnSignup: 5,
  },
  pro: {
    maxSlides: 20,
    fileUpload: true,
    maxFiles: 10,
    maxImages: 10,
    fullHistory: true,
    creditsOnSignup: 15,
  },
}

export function getPlanLimits(planName: string): PlanLimits {
  return PLAN_LIMITS[planName as PlanName] || PLAN_LIMITS.free
}

export const PLAN_DISPLAY: Record<PlanName, {
  name: string
  color: string
  badge: string
}> = {
  free:    { name: 'Free',    color: 'slate',   badge: '🆓' },
  starter: { name: 'Starter', color: 'emerald', badge: '⭐' },
  pro:     { name: 'Pro',     color: 'amber',   badge: '🔥' },
}
