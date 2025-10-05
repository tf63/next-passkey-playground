"use client"

import { Key } from "lucide-react"
import { redirect } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { registerAction } from "@/app/actions/password/register"
import { signInAction } from "@/app/actions/sign-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isPending, startTransition] = useTransition()

	const handleSignUp = (e: React.FormEvent) => {
		e.preventDefault()

		startTransition(async () => {
			if (!email || !password) {
				toast.error("Email and password are required")
				return
			}

			const result = await registerAction({ email, password })
			if (!result.success) {
				toast.error(result.message)
				return
			}

			redirect("/")
		})
	}

	const handleSignIn = (e: React.FormEvent) => {
		e.preventDefault()

		startTransition(async () => {
			if (!email || !password) {
				toast.error("Email and password are required")
				return
			}

			const result = await signInAction({ email, password })
			if (!result.success) {
				toast.error(result.message)
				return
			}

			redirect("/")
		})
	}

	const handlePasskeyLogin = () => {
		startTransition(() => {
			try {
				// ここで WebAuthn / simplewebauthn の処理を呼び出す
				console.log("Passkey login triggered")
				// 実装例: await signIn("passkey")
			} catch {
				toast.error("Passkey authentication failed")
			}
		})
	}

	return (
		<Tabs defaultValue="signin" className="w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="signin" className="dark:data-[state=active]:bg-primary">
					Sign In
				</TabsTrigger>
				<TabsTrigger value="signup" className="dark:data-[state=active]:bg-primary">
					Sign Up
				</TabsTrigger>
			</TabsList>

			{/* Sign In */}
			<TabsContent value="signin">
				<form onSubmit={handleSignIn} className="mt-4 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="signin-email">Email</Label>
						<Input
							id="signin-email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signin-password">Password</Label>
						<Input
							id="signin-password"
							type="password"
							placeholder="••••••••"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Loading..." : "Sign In"}
					</Button>
				</form>

				{/* Divider */}
				<div className="my-4 flex items-center">
					<div className="flex-grow border-t border-gray-300" />
					<span className="px-2 text-sm text-gray-500">or</span>
					<div className="flex-grow border-t border-gray-300" />
				</div>

				{/* Passkey Button */}
				<Button variant="outline" className="w-full" onClick={handlePasskeyLogin} disabled={isPending}>
					<Key className="mr-2 h-5 w-5" />
					Continue with Passkey
				</Button>
			</TabsContent>

			{/* Sign Up */}
			<TabsContent value="signup">
				<form onSubmit={handleSignUp} className="mt-4 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="signup-email">Email</Label>
						<Input
							id="signup-email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signup-password">Password</Label>
						<Input
							id="signup-password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required={true}
						/>
					</div>
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Loading..." : "Sign Up"}
					</Button>
				</form>
			</TabsContent>
		</Tabs>
	)
}
