import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_CONFIG: Record<string, { amount: number; credits: number; name: string }> = {
    starter: { amount: 2100, credits: 5, name: 'Starter' },
    pro: { amount: 5250, credits: 15, name: 'Pro' },
}

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { planId } = body
    const plan = PLAN_CONFIG[planId]
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    // Create pending payment record using admin to bypass RLS
    const { data: payment } = await supabaseAdmin.from('payments').insert({
        user_id: user.id,
        amount_pkr: plan.amount,
        credits_purchased: plan.credits,
        plan_name: plan.name,
        status: 'pending',
    }).select().single()

    // Safepay checkout URL
    const safepayRes = await fetch('https://sandbox.api.getsafepay.com/order/v1/init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-SFPY-MERCHANT-SECRET': process.env.SAFEPAY_SECRET_KEY!,
        },
        body: JSON.stringify({
            client: process.env.NEXT_PUBLIC_SAFEPAY_PUBLIC_KEY,
            environment: 'sandbox',
            currency: 'PKR',
            amount: plan.amount * 100, // Safepay expects paisa as number
            order_id: payment?.id || 'TEST_ORDER',
            source: 'checkout',
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        }),
    })

    if (!safepayRes.ok) {
        const errorText = await safepayRes.text()
        console.error('Safepay Error:', safepayRes.status, errorText)
        // Fallback: direct to pricing page
        return NextResponse.json({
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            message: 'Payment gateway unavailable. Please try again.',
        })
    }

    const safepayData = await safepayRes.json()
    const tracker = safepayData?.data?.tracker?.token

    // Save tracker
    if (tracker && payment?.id) {
        await supabaseAdmin.from('payments').update({ safepay_tracker: tracker }).eq('id', payment.id)
    }

    const checkoutUrl = `https://sandbox.api.getsafepay.com/components?env=sandbox&beacon=${tracker}&source=custom`

    return NextResponse.json({ redirect_url: checkoutUrl })
}
