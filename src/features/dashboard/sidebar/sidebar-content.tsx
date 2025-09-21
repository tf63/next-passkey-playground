import { Calendar, Home, Inbox, Key, Search, Settings, UserCheck, UserPlus } from "lucide-react"
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

const documentItems = [
	{
		title: "登録フロー",
		url: "/#",
		icon: UserPlus,
	},
	{
		title: "検証フロー",
		url: "/#",
		icon: UserCheck,
	},
]

const dataItems = [
	{
		title: "Home",
		url: "/#",
		icon: Home,
	},
	{
		title: "Inbox",
		url: "/#",
		icon: Inbox,
	},
	{
		title: "Calendar",
		url: "/#",
		icon: Calendar,
	},
	{
		title: "Search",
		url: "/#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "/#",
		icon: Settings,
	},
]

export function DashboardSidebarContent() {
	return (
		<SidebarContent>
			<SidebarGroup className="px-4">
				<SidebarGroupLabel>Passkey</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild={true} tooltip="パスキー登録">
								<a href={"/passkey"}>
									<Key />
									<span>パスキー登録</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			<SidebarGroup className="px-4">
				<SidebarGroupLabel>Document</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{documentItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild={true} tooltip={item.title}>
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

			<SidebarGroup className="px-4">
				<SidebarGroupLabel>Data</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{dataItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild={true} tooltip={item.title}>
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
	)
}
