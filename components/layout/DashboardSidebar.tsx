'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Presentation,
    Table2,
    CreditCard,
    LogOut,
    Pill,
    ChevronRight,
    X,
    Menu,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Presentation, label: 'Presentation', href: '/presentation' },
    { icon: Table2, label: 'Excel Sheet', href: '/excel' },
    { icon: CreditCard, label: 'Buy Credits', href: '/pricing' },
]

export default function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/login')
    }

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Backdrop */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full z-40 w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Pill className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">PharmaDeck</span>
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className="font-medium text-sm">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-400" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
