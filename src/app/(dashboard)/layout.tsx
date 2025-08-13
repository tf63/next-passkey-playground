import { Calendar, ChevronUp, Home, Inbox, Key, Search, Settings, User2, UserCheck, UserPlus } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

const documentItems = [
    {
        title: '登録フロー',
        url: '#',
        icon: UserPlus,
    },
    {
        title: '検証フロー',
        url: '#',
        icon: UserCheck,
    },
]

const dataItems = [
    {
        title: 'Home',
        url: '#',
        icon: Home,
    },
    {
        title: 'Inbox',
        url: '#',
        icon: Inbox,
    },
    {
        title: 'Calendar',
        url: '#',
        icon: Calendar,
    },
    {
        title: 'Search',
        url: '#',
        icon: Search,
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
    },
]

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar>
                <div className="flex h-full flex-col justify-between px-3 py-4">
                    <div>
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
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>Document</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {documentItems.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild={true}>
                                                    <a href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>Data</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {dataItems.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild={true}>
                                                    <a href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </div>
                    <div>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild={true}>
                                            <SidebarMenuButton>
                                                <User2 /> Username
                                                <ChevronUp className="ml-auto" />
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                            <DropdownMenuItem>
                                                <span>Account</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span>Sign out</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </div>
                </div>
            </Sidebar>
            <main className="flex min-h-screen w-full justify-center">
                <div className="max-w-5xl space-y-4 p-4 2xl:max-w-6xl">
                    <SidebarTrigger />
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
