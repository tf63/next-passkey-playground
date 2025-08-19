import { Sidebar } from '@/components/ui/sidebar'
import { DashboardSidebarContent } from '@/features/dashboard/sidebar/sidebar-content'
import { DashboardSidebarFooter } from '@/features/dashboard/sidebar/sidebar-footer'
import { DashboardSidebarHeader } from '@/features/dashboard/sidebar/sidebar-header'

export function DashboardSidebar() {
    return (
        <Sidebar>
            <div className="flex h-full flex-col justify-between px-3 py-4">
                <div>
                    <DashboardSidebarHeader />
                    <DashboardSidebarContent />
                </div>
                <div>
                    <DashboardSidebarFooter />
                </div>
            </div>
        </Sidebar>
    )
}
