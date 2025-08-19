import { Key } from 'lucide-react'

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function DashboardSidebarHeader() {
    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild={true}>
                        <a href="/">
                            <Key />
                            <span>Passkey Sample</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    )
}
