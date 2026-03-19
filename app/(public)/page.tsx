'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Zap, Download, Star, ChevronDown, ChevronUp,
    Presentation, Table2, ArrowRight, CheckCircle2,
    Monitor, Sparkles, TrendingUp
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PricingSection, { type PricingPlan } from '@/components/ui/PricingCard'
import PricingModal from '@/components/ui/PricingModal'
import { useRouter } from 'next/navigation'

const faqs = [
    {
        q: 'How long does generation take?',
        a: 'Presentations take 30–60 seconds. Excel sheets are ready in under 10 seconds. Our AI works fast so you don\'t have to wait.',
    },
    {
        q: 'What subjects can I use it for?',
        a: 'Any pharmacy subject — Pharmacology, Clinical Pharmacy, Pharmaceutics, Pharmacokinetics, Medicinal Chemistry, and more.',
    },
    {
        q: 'Can I edit the generated files?',
        a: 'Yes! Both .pptx and .xlsx files are fully editable in PowerPoint and Excel after downloading.',
    },
    {
        q: 'How does the credit system work?',
        a: '1 credit = 1 generation (presentation or excel). You get 2 free credits on signup — no card required.',
    },
]

const testimonials = [
    {
        text: "I made my entire Clinical Pharmacy seminar presentation in 2 minutes. My professor was seriously impressed!",
        name: "Fatima K.",
        role: "4th Year Pharm.D",
        stars: 5,
    },
    {
        text: "The drug comparison Excel sheets are incredibly detailed. Saved me 3 hours of manual work on my pharmacology project.",
        name: "Ahmed R.",
        role: "3rd Year Pharmacy",
        stars: 5,
    },
    {
        text: "Best investment for pharmacy school. My GPA improved because I can study smarter with these AI-generated sheets.",
        name: "Sara M.",
        role: "Final Year Pharm.D",
        stars: 5,
    },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
        >
            <button
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(!open)}
            >
                <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
                {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-6 py-4 bg-white border-t border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
                </div>
            )}
        </motion.div>
    )
}

export default function Homepage() {
    const [pricingOpen, setPricingOpen] = useState(false)
    const router = useRouter()

    const handleBuyPlan = (plan: PricingPlan) => {
        if (plan.id === 'free') {
            router.push('/signup')
            return
        }
        router.push('/signup')
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            <Navbar />

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO */}
            <section className="relative pt-24 pb-20 overflow-hidden hero-grid">
                {/* Gradient orbs */}
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-2 text-sm font-semibold mb-6"
                        >
                            🎓 Built for Pharmacy Students in Pakistan
                        </motion.div>

                        {/* H1 */}
                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6"
                        >
                            Turn Your Notes Into{' '}
                            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                                Professional Slides
                            </span>{' '}
                            &amp; Study Sheets
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed"
                        >
                            Stop spending hours making presentations. PharmaDeck uses AI to generate
                            professional PowerPoint slides and color-coded Excel study sheets in seconds.
                            Used by 500+ pharmacy students to boost their GPA.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                        >
                            <Link
                                href="/signup"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-8 py-4 text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                            >
                                <Presentation className="w-5 h-5" />
                                Generate Presentation
                            </Link>
                            <Link
                                href="/signup"
                                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-xl px-8 py-4 text-base flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <Table2 className="w-5 h-5" />
                                Create Excel Sheet
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
                        >
                            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-500" /> 30 sec generation</span>
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Professional quality</span>
                            <span>🇵🇰 Made for Pakistan</span>
                        </motion.div>
                    </div>

                    {/* Hero mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-16 max-w-4xl mx-auto"
                    >
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                            {/* Browser bar */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <div className="ml-4 flex-1 bg-slate-700 rounded-md px-3 py-1 text-slate-400 text-xs">
                                    pharmadeck.pk/dashboard
                                </div>
                            </div>
                            {/* Mock dashboard */}
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">Total Presentations</p>
                                    <p className="text-white font-bold text-2xl">24</p>
                                    <div className="mt-2 h-1 bg-emerald-500/30 rounded-full"><div className="h-1 bg-emerald-500 rounded-full w-3/4" /></div>
                                </div>
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">Excel Sheets</p>
                                    <p className="text-white font-bold text-2xl">18</p>
                                    <div className="mt-2 h-1 bg-blue-500/30 rounded-full"><div className="h-1 bg-blue-500 rounded-full w-1/2" /></div>
                                </div>
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">Credits Left</p>
                                    <p className="text-emerald-400 font-bold text-2xl">7</p>
                                    <div className="mt-2 h-1 bg-emerald-500/30 rounded-full"><div className="h-1 bg-emerald-500 rounded-full w-2/3" /></div>
                                </div>
                                <div className="sm:col-span-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-emerald-400 font-semibold text-sm">Latest: Pharmacokinetics of Beta-Blockers</p>
                                        <p className="text-slate-400 text-xs">12 slides • Generated 2 minutes ago</p>
                                    </div>
                                    <button className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                        <Download className="w-3 h-3" /> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ STATS */}
            <section className="bg-[#0F172A] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {[
                            { value: '500+', label: 'Students', icon: '🎓' },
                            { value: '2,000+', label: 'Presentations Generated', icon: '📊' },
                            { value: '4.9★', label: 'Average Rating', icon: '⭐' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FEATURES */}
            <section id="features" className="py-20 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                            ✨ Features
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                            Everything You Need to Excel{' '}
                            <span className="text-emerald-500">(Pun Intended)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">AI PowerPoint Generator</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5">
                                Enter your pharmacy topic — Drug Mechanisms, Clinical Cases, Pharmacokinetics —
                                and get a complete professional presentation in 30 seconds. Perfect for seminars,
                                vivas, and group projects.
                            </p>
                            <ul className="space-y-2 mb-6">
                                {['5–20 professional slides', 'Pharmacy-optimized content', 'Instant .pptx download', 'Works for any subject'].map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700">
                                Try Free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Excel Study Sheets</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5">
                                Generate color-coded Excel tables for drug comparisons, pharmacokinetics data,
                                clinical notes, and more. Study smarter with organized, beautiful spreadsheets.
                            </p>
                            <ul className="space-y-2 mb-6">
                                {['Color-coded headers', 'Multiple sheets', 'Auto-formatted columns', 'Instant .xlsx download'].map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700">
                                Try Free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HOW IT WORKS */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                            ⚡ How It Works
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                            3 Simple Steps to{' '}
                            <span className="text-emerald-500">Study Smarter</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', icon: '📝', title: 'Enter Your Topic', desc: 'Type any pharmacy topic or paste your notes. Be as specific as you want for better results.' },
                            { step: '2', icon: '🤖', title: 'AI Does the Work', desc: 'Our AI generates professional content tailored for pharmacy students in seconds.' },
                            { step: '3', icon: '📥', title: 'Download & Use', desc: 'Get your file instantly. Fully editable in PowerPoint or Excel — ready to present or study.' },
                        ].map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="text-center relative"
                            >
                                {i < 2 && <div className="hidden md:block absolute top-10 left-3/4 w-1/2 h-px border-t-2 border-dashed border-emerald-200" />}
                                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                    {step.icon}
                                </div>
                                <div className="inline-block bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mb-3 mx-auto -mt-12 relative">
                                    {step.step}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ PRICING */}
            <section id="pricing" className="py-20 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                            💳 Pricing
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
                            Simple, Affordable Pricing
                        </h2>
                        <p className="text-slate-600 text-base max-w-md mx-auto">
                            No subscriptions. No hidden fees.<br />
                            Start free, pay only when you need more.
                        </p>
                    </div>
                    <PricingSection onBuy={handleBuyPlan} />
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ TESTIMONIALS */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900">Loved by Pharmacy Students</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6"
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: t.stars }).map((_, s) => (
                                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                                    <p className="text-slate-500 text-xs">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FAQ */}
            <section className="py-20 bg-[#F8FAFC]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CTA BANNER */}
            <section className="py-16 bg-gradient-to-r from-emerald-600 to-cyan-600">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">
                        Ready to Study Smarter?
                    </h2>
                    <p className="text-emerald-100 mb-8">Join 500+ pharmacy students. Get 2 free credits today — no card required.</p>
                    <Link
                        href="/signup"
                        className="bg-white text-emerald-700 font-bold rounded-xl px-8 py-4 text-base inline-flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-xl"
                    >
                        <Zap className="w-5 h-5" /> Get Started Free
                    </Link>
                </div>
            </section>

            <Footer />
            <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
    )
}
