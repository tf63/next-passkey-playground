"use client"
import { startRegistration } from "@simplewebauthn/browser"
import { Fingerprint } from "lucide-react"
import { useTransition } from "react"
import { getRegistrationOptions, verifyRegistration } from "@/app/actions/passkey/register"
import { Button } from "@/components/ui/button"

export function PasskeyRegisterBlock({ email }: { email: string }) {
	const [isPending, startTransition] = useTransition()

	const handleRegister = () => {
		startTransition(async () => {
			if (!email) {
				alert("メールアドレスが取得できませんでした。サインインしてください。")
				return
			}

			const { options, message } = await getRegistrationOptions(email)
			if (!options) {
				alert(`登録オプションの取得に失敗しました: ${message}`)
				return
			}
			const cred = await startRegistration({ optionsJSON: options })
			const { verified, message: verificationMessage } = await verifyRegistration(email, cred)
			if (verified) {
				alert("パスキー登録に成功しました")
			} else {
				alert(`パスキー登録に失敗しました: ${verificationMessage}`)
			}
		})
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 text-lg font-bold">
				<Fingerprint className="h-5 w-5" />
				パスキー登録
			</div>

			<div className="flex justify-between items-center max-w-3xl gap-8 bg-background px-8 py-4 rounded-md">
				<p className="text-gray-200">新しいパスキーを登録して、次回からパスワード不要でログインできます。</p>
				<Button size="lg" className="rounded-xl shadow-sm" onClick={handleRegister} disabled={isPending}>
					パスキー登録
				</Button>
			</div>
		</div>
	)
}
