const SAFEPAY_BASE = 'https://sandbox.api.getsafepay.com'
const SAFEPAY_SECRET = '8b23e0f45deaee27025778e8fdc5582d34e29a323ef5759f57a294b1866421'
const PUBLIC_KEY = 'sec_75b0426e-a0e2-42b5-9317-412d9477bd52'

async function testInit() {
    // Testing with decimal PKR (2100.00)
    const payload = {
        client: PUBLIC_KEY,
        amount: 2100, // PKR instead of paisas
        currency: 'PKR',
        environment: 'sandbox',
    }
    
    const trackerRes = await fetch(`${SAFEPAY_BASE}/order/v1/init`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SAFEPAY_SECRET}`,
        },
        body: JSON.stringify(payload),
    })

    const data = await trackerRes.json()
    console.log('Status:', trackerRes.status)
    console.log('Returned Token:', data?.data?.token)
    console.log('Returned Amount:', data?.data?.amount)
}

testInit()
