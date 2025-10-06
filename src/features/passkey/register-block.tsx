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
			try {
				if (!email) {
					throw new Error("メールアドレスが未設定です")
				}

				const { options, message } = await getRegistrationOptions(email)
				if (!options) {
					throw new Error(`登録オプションの取得に失敗しました: ${message}`)
				}

				const cred = await startRegistration({ optionsJSON: options })
				const { verified, message: verificationMessage } = await verifyRegistration(email, cred)
				if (!verified) {
					throw new Error(`パスキー登録の検証に失敗しました: ${verificationMessage}`)
				}

				alert("パスキー登録に成功しました")
			} catch (error) {
				alert(`パスキー登録中にエラーが発生しました: ${error}`)
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
