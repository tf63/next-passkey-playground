import { Sidebar, SidebarRail } from '@/components/ui/sidebar'
import { DashboardSidebarContent } from '@/features/dashboard/sidebar/sidebar-content'
import { DashboardSidebarFooter } from '@/features/dashboard/sidebar/sidebar-footer'
import { DashboardSidebarHeader } from '@/features/dashboard/sidebar/sidebar-header'

export function DashboardSidebar() {
    return (
        <Sidebar collapsible="icon">
            <div className="flex h-full flex-col justify-between py-4">
                <div>
                    <DashboardSidebarHeader />
                    <DashboardSidebarContent />
                </div>
                <div>
                    <DashboardSidebarFooter />
                    <SidebarRail />
                </div>
            </div>
        </Sidebar>
    )
}
