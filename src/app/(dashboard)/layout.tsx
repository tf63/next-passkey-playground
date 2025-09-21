import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/dashboard/sidebar/sidebar"
import { DashboardSidebarProvider } from "@/features/dashboard/sidebar/sidebar-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<DashboardSidebarProvider>
			<DashboardSidebar />
			<div className="flex min-h-screen w-full justify-center">
				<div className="m-4 w-5xl space-y-4 p-4 2xl:w-6xl">
					<SidebarTrigger />
					<div className="space-y-6">{children}</div>
				</div>
			</div>
		</DashboardSidebarProvider>
	)
}
