import { Key } from 'lucide-react'

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function DashboardSidebarHeader() {
    return (
        <SidebarHeader className="px-4">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild={true} tooltip="Home">
                        <a href="/">
                            <Key className="w-4" />
                            <span>Passkey Sample</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    )
}
