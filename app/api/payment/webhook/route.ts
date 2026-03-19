import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_CREDITS: Record<string, { credits: number; plan: string }> = {
  starter:   { credits: 5,  plan: 'starter' },
  pro:       { credits: 15, plan: 'pro' },
  unlimited: { credits: 50, plan: 'pro' },
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-sfpy-signature') || ''
  
  // Verify webhook signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.SAFEPAY_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex')

  if (signature !== expectedSig) {
    console.error('Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  // Only handle successful payments
  if (event?.type !== 'payment:created') {
    return NextResponse.json({ received: true })
  }

  const trackerToken = event?.data?.tracker?.token
  if (!trackerToken) {
    return NextResponse.json({ received: true })
  }

  // Find the pending payment
  const { data: payment } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('safepay_tracker', trackerToken)
    .eq('status', 'pending')
    .single()

  if (!payment) {
    return NextResponse.json({ received: true })
  }

  const planInfo = PLAN_CREDITS[payment.plan_name]
  if (!planInfo) {
    return NextResponse.json({ received: true })
  }

  // Add credits + update plan using Supabase RPC
  // This requires the add_credits(p_user_id, p_credits, p_plan) RPC to be created
  await supabaseAdmin.rpc('add_credits', {
    p_user_id: payment.user_id,
    p_credits: planInfo.credits,
    p_plan: planInfo.plan,
  })

  // Mark payment as completed
  await supabaseAdmin
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', payment.id)

  return NextResponse.json({ received: true })
}
