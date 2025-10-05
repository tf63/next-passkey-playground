import { Key } from "lucide-react"
import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardTitle } from "@/features/dashboard/title/title"
import { PasskeyRegisterBlock } from "@/features/passkey/register-block"
import { PasskeyVerifyBlock } from "@/features/passkey/verify-block"

export default async function Page() {
	const session = await auth()
	if (!session) {
		return <div>サインインしてください</div>
	}

	const { email } = session.user

	return (
		<>
			<DashboardTitle title="パスキー" />

			<Card>
				<CardContent>
					<PasskeyRegisterBlock email={email} />
					<hr className="my-6" />
					<PasskeyVerifyBlock email={email} />
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<h2 className="text-lg font-bold mb-4 flex gap-2 items-center">
						<Key className="h-5 w-5" />
						登録済みパスキー
					</h2>
					<div>
						<p className="text-gray-200">登録されたパスキーはまだありません。</p>
					</div>
				</CardContent>
			</Card>
		</>
	)
}
