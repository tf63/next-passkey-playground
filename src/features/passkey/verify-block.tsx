"use client"
import { startAuthentication } from "@simplewebauthn/browser"
import { Fingerprint } from "lucide-react"
import { useTransition } from "react"
import { getAuthenticationOptions, verifyAuthentication } from "@/app/actions/passkey/verify"
import { Button } from "@/components/ui/button"

export function PasskeyVerifyBlock({ email }: { email: string }) {
	const [isPending, startTransition] = useTransition()

	const handleVerify = () => {
		startTransition(async () => {
			if (!email) {
				alert("メールアドレスが取得できませんでした。サインインしてください。")
				return
			}

			const { options, message } = await getAuthenticationOptions(email)
			if (!options) {
				alert(`パスキー認証オプションの取得に失敗しました: ${message}`)
				return
			}
			const cred = await startAuthentication({ optionsJSON: options })
			const { verified, message: verificationMessage } = await verifyAuthentication(email, cred)
			if (verified) {
				alert("パスキー認証に成功しました")
			} else {
				alert(`パスキー認証に失敗しました: ${verificationMessage}`)
			}
		})
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 text-lg font-bold">
				<Fingerprint className="h-5 w-5" />
				パスキー検証
			</div>

			<div className="flex justify-between items-center max-w-3xl gap-8 bg-background px-8 py-4 rounded-md">
				<p className="text-gray-200">パスキー検証画面を表示します。</p>
				<Button size="lg" className="rounded-xl shadow-sm" onClick={handleVerify} disabled={isPending}>
					パスキー検証
				</Button>
			</div>
		</div>
	)
}
