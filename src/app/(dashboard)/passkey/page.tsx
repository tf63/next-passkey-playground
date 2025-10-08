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
		</>
	)
}
