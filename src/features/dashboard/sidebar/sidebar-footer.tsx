import { ChevronUp, User2 } from 'lucide-react'

import { signOutAction } from '@/app/actions/sign-out'
import { auth } from '@/auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export async function DashboardSidebarFooter() {
    const session = await auth()
    const email = session?.user?.email

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild={true}>
                            <SidebarMenuButton>
                                <User2 /> <span className="truncate">{email ? email : 'Invalid User'}</span>
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuItem>
                                <span>Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <form action={signOutAction}>
                                    <button type="submit">Sign out</button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}
