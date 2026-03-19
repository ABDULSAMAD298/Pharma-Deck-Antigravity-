'use client'

import Link from 'next/link'
import { Pill, Twitter, Instagram, Mail, Github } from 'lucide-react'

const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
]

export default function Footer() {
    return (
        <footer className="bg-[#0F172A] border-t border-[#334155]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">PharmaDeck</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            AI-powered presentations &amp; study sheets for pharmacy students. Study smarter. Score higher.
                        </p>
                        <div className="flex items-center gap-4 mt-5">
                            <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="mailto:support@pharmadeck.pk" className="text-slate-500 hover:text-emerald-400 transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
                        <ul className="space-y-2.5 text-sm text-slate-400">
                            <li>
                                <a href="mailto:support@pharmadeck.pk" className="hover:text-emerald-400 transition-colors">
                                    support@pharmadeck.pk
                                </a>
                            </li>
                            <li className="leading-relaxed">
                                Built for Pakistani pharmacy students.<br />
                                Available 24/7 online.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} PharmaDeck. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm">
                        Made with ❤️ for Pharmacy Students in Pakistan 🇵🇰
                    </p>
                </div>
            </div>
        </footer>
    )
}
