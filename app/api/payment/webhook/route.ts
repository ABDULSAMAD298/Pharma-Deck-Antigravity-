import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.json()

    // Verify and process Safepay webhook
    const { tracker, order_id, status } = body

    if (status !== 'paid') {
        return NextResponse.json({ received: true })
    }

    // Find payment record
    const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('id', order_id)
        .single()

    if (!payment || payment.status === 'completed') {
        return NextResponse.json({ received: true })
    }

    // Mark payment as completed
    await supabaseAdmin.from('payments')
        .update({ status: 'completed', safepay_tracker: tracker })
        .eq('id', order_id)

    // Add credits to user
    const { data: credits } = await supabaseAdmin
        .from('credits')
        .select('*')
        .eq('user_id', payment.user_id)
        .single()

    if (credits) {
        await supabaseAdmin.from('credits').update({
            total_credits: (credits.total_credits ?? 0) + payment.credits_purchased,
            updated_at: new Date().toISOString(),
        }).eq('user_id', payment.user_id)
    }

    return NextResponse.json({ received: true })
}
