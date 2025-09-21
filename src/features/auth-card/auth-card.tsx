import { Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/features/auth-card/auth-form"

export function AuthCard() {
	return (
		<Card className="mt-40 w-md px-3 py-6">
			<CardHeader className="text-center">
				<CardTitle className="flex items-center justify-center gap-2 text-xl font-bold">
					<Key />
					<span>Passkey Sample</span>
				</CardTitle>
				<CardDescription>Sign in or create a new account</CardDescription>
			</CardHeader>

			<CardContent>
				<AuthForm />
			</CardContent>
		</Card>
	)
}
