const SAFEPAY_BASE = 'https://sandbox.api.getsafepay.com'
const SAFEPAY_SECRET = '8b23e0f45deaee27025778e8fdc5582d34e29a323ef5759f57a294b1866421'
const PUBLIC_KEY = 'sec_75b0426e-a0e2-42b5-9317-412d9477bd52'

async function generateCheckoutUrl() {
    const amount = 210000 // 2100 PKR
    const env = 'sandbox'
    
    // Init
    const trackerRes = await fetch(`${SAFEPAY_BASE}/order/v1/init`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SAFEPAY_SECRET}`,
        },
        body: JSON.stringify({
            client: PUBLIC_KEY,
            amount: amount,
            currency: 'PKR',
            environment: env,
        }),
    })

    const trackerData = await trackerRes.json()
    const trackerToken = trackerData?.data?.token

    if (!trackerToken) {
        console.log('Failed to get token:', trackerData)
        return
    }

    const checkoutUrl = new URL(`${SAFEPAY_BASE}/components`)
    checkoutUrl.searchParams.set('env', env)
    checkoutUrl.searchParams.set('beacon', trackerToken)
    checkoutUrl.searchParams.set('source', 'PharmaDeck')
    checkoutUrl.searchParams.set('order_id', 'TEST_ORDER_123')
    checkoutUrl.searchParams.set('redirect_url', 'http://localhost:3000/payment/success')
    checkoutUrl.searchParams.set('cancel_url', 'http://localhost:3000/payment/cancelled')

    console.log('GENERATED CHECKOUT URL:')
    console.log(checkoutUrl.toString())
}

generateCheckoutUrl()
