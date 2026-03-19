'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'How It Works', href: '/#how-it-works' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'bg-[#0F172A]/95 backdrop-blur-xl border-b border-[#334155] shadow-xl'
                        : 'bg-[#0F172A] border-b border-[#334155]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-200">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">
                                PharmaDeck
                            </span>
                        </Link>

                        {/* Center Nav Links — Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-[#94A3B8] hover:text-[#10B981] transition-colors duration-200 font-medium text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side — Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-semibold rounded-xl px-5 py-2 text-sm transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl px-5 py-2 text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Hamburger — Mobile */}
                        <button
                            className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[#0F172A] flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {/* Logo at top */}
                        <div className="absolute top-4 left-4 flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">PharmaDeck</span>
                        </div>
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X className="w-7 h-7" />
                        </button>

                        {/* Links */}
                        <div className="flex flex-col items-center gap-6 w-full px-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="w-full text-center"
                                >
                                    <Link
                                        href={link.href}
                                        className="text-2xl font-semibold text-slate-200 hover:text-emerald-400 transition-colors duration-200"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="w-full h-px bg-slate-700 my-2" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col gap-3 w-full"
                            >
                                <Link
                                    href="/login"
                                    className="w-full text-center border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-semibold rounded-xl px-5 py-3 text-base transition-all duration-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="w-full text-center bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl px-5 py-3 text-base transition-all duration-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
