import DashboardSidebar from '@/components/layout/DashboardSidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#0F172A]">
            <DashboardSidebar />
            <main className="flex-1 lg:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
