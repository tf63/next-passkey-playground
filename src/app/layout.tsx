import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Passkey Sample",
	description: "Passkey Sample with Next.js 15",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ja" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<main className="min-h-screen min-w-screen">{children}</main>
				<Toaster theme="dark" richColors={true} position="top-center" />
			</body>
		</html>
	)
}
