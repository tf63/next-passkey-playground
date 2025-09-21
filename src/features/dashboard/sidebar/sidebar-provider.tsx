import { SidebarProvider } from "@/components/ui/sidebar"

export function DashboardSidebarProvider({ children }: { children: React.ReactNode }) {
	// 外からmobileの幅は制御できなそう
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "16rem",
					"--sidebar-width-icon": "4rem",
				} as React.CSSProperties
			}
		>
			{children}
		</SidebarProvider>
	)
}
