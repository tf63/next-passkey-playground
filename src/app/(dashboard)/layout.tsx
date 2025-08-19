import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/features/dashboard/sidebar/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex min-h-screen w-full justify-center">
                <div className="max-w-5xl space-y-4 p-4 2xl:max-w-6xl">
                    <SidebarTrigger />
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
