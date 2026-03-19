import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Safepay sandbox base URL
const SAFEPAY_BASE = process.env.NEXT_PUBLIC_SAFEPAY_ENV === 'production'
  ? 'https://api.getsafepay.com'
  : 'https://sandbox.api.getsafepay.com'

const SAFEPAY_SECRET = process.env.SAFEPAY_SECRET_KEY!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// UPDATED: Use PKR directly as the API seems to expect full PKR values
// (If these were paisas, Safepay would show Rs. 2,100.00)
const PLAN_AMOUNTS: Record<string, number> = {
  starter:   2100,  // Rs. 2,100
  pro:       5250,  // Rs. 5,250
  unlimited: 5500,  // Rs. 5,500 
}

export async function POST(req: Request) {
  // Auth check
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan_name } = await req.json()

  // Use the PKR amount directly
  const amountPkr = PLAN_AMOUNTS[plan_name]
  if (!amountPkr) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const orderId = `pharma_${user.id.slice(0, 8)}_${Date.now()}`

  // STEP 1: Create tracker with Safepay API
  try {
    const env = process.env.NEXT_PUBLIC_SAFEPAY_ENV === 'production' ? 'production' : 'sandbox'
    
    // Correct Safepay init payload
    const trackerRes = await fetch(`${SAFEPAY_BASE}/order/v1/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SAFEPAY_SECRET}`,
      },
      body: JSON.stringify({
        client: process.env.NEXT_PUBLIC_SAFEPAY_PUBLIC_KEY,
        amount: amountPkr,
        currency: 'PKR',
        environment: env,
      }),
    })

    if (!trackerRes.ok) {
        const errJson = await trackerRes.json()
        console.error('Safepay tracker error status:', trackerRes.status, errJson)
        return NextResponse.json(
          { error: `Payment setup failed: ${JSON.stringify(errJson?.status?.errors || 'Unknown error')}` },
          { status: 500 }
        )
    }

    const trackerData = await trackerRes.json()
    const trackerToken = trackerData?.data?.token

    if (!trackerToken) {
      return NextResponse.json(
        { error: 'No tracker token received from Safepay' },
        { status: 500 }
      )
    }

    // STEP 2: Save pending payment to database
    await supabase.from('payments').insert({
      user_id: user.id,
      amount_pkr: amountPkr,
      credits_purchased: plan_name === 'starter' ? 5 : plan_name === 'pro' ? 15 : 50,
      plan_name,
      safepay_tracker: trackerToken,
      status: 'pending',
    })

    // STEP 3: Build checkout URL
    const checkoutUrl = new URL(`${SAFEPAY_BASE}/checkout/pay`)
    checkoutUrl.searchParams.set('env', env)
    checkoutUrl.searchParams.set('beacon', trackerToken)
    checkoutUrl.searchParams.set('source', 'PharmaDeck')
    checkoutUrl.searchParams.set('order_id', orderId)
    checkoutUrl.searchParams.set(
      'redirect_url',
      `${APP_URL}/payment/success?plan=${plan_name}&tracker=${trackerToken}`
    )
    checkoutUrl.searchParams.set(
      'cancel_url',
      `${APP_URL}/payment/cancelled`
    )

    return NextResponse.json({
      checkout_url: checkoutUrl.toString(),
      tracker: trackerToken,
      order_id: orderId,
    })

  } catch (err: any) {
    console.error('Payment initialization error:', err)
    return NextResponse.json(
      { error: 'Payment service unavailable. Please contact support.' },
      { status: 500 }
    )
  }
}
