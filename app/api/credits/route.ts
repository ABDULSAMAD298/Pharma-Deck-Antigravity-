import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!credits) return NextResponse.json({ error: 'Credits not found' }, { status: 404 })

    return NextResponse.json({
        total: credits.total_credits,
        used: credits.used_credits,
        remaining: credits.total_credits - credits.used_credits,
    })
}
