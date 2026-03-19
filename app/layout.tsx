import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'PharmaDeck – Study Smarter. Score Higher.',
    description: 'AI-powered presentations & study sheets for pharmacy students in Pakistan. Generate professional PowerPoint slides and color-coded Excel sheets in seconds.',
    keywords: 'pharmacy students, presentations, excel sheets, AI, Pakistan, study tool, PharmaDeck',
    openGraph: {
        title: 'PharmaDeck – AI Study Tool for Pharmacy Students',
        description: 'Generate professional slides and Excel study sheets with AI in seconds.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1E293B',
                            color: '#F1F5F9',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            fontFamily: 'Inter, sans-serif',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#F1F5F9',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#F1F5F9',
                            },
                        },
                    }}
                />
            </body>
        </html>
    )
}
