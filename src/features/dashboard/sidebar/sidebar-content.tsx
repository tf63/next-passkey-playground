import { Key, UserCheck, UserPlus } from "lucide-react"
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
		url: "/docs/register-flow",
		icon: UserPlus,
	},
	{
		title: "検証フロー",
		url: "/docs/verify-flow",
		icon: UserCheck,
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
							<SidebarMenuButton asChild={true} tooltip="パスキー管理">
								<a href={"/passkey"}>
									<Key />
									<span>パスキー管理</span>
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
		</SidebarContent>
	)
}
