export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    email: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            credits: {
                Row: {
                    id: string
                    user_id: string
                    total_credits: number
                    used_credits: number
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    total_credits?: number
                    used_credits?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    total_credits?: number
                    used_credits?: number
                    updated_at?: string
                }
            }
            generations: {
                Row: {
                    id: string
                    user_id: string
                    type: 'presentation' | 'excel'
                    topic: string
                    download_url: string | null
                    file_name: string | null
                    slides_count: number | null
                    language: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'presentation' | 'excel'
                    topic: string
                    download_url?: string | null
                    file_name?: string | null
                    slides_count?: number | null
                    language?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'presentation' | 'excel'
                    topic?: string
                    download_url?: string | null
                    file_name?: string | null
                    slides_count?: number | null
                    language?: string | null
                    status?: string
                    created_at?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    user_id: string
                    amount_pkr: number
                    credits_purchased: number
                    plan_name: string | null
                    safepay_tracker: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount_pkr: number
                    credits_purchased: number
                    plan_name?: string | null
                    safepay_tracker?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount_pkr?: number
                    credits_purchased?: number
                    plan_name?: string | null
                    safepay_tracker?: string | null
                    status?: string
                    created_at?: string
                }
            }
        }
    }
}
