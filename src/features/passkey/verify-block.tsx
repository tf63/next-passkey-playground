"use client"
import { startAuthentication } from "@simplewebauthn/browser"
import { Fingerprint } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { getAuthenticationOptions, verifyAuthentication } from "@/app/actions/passkey/verify"
import { Button } from "@/components/ui/button"

export function PasskeyVerifyBlock({ email }: { email: string }) {
	const [isLoading, setIsLoading] = useState(false)

	const handleVerify = async () => {
		setIsLoading(true)
		try {
			if (!email) {
				throw new Error("メールアドレスが未設定です")
			}

			const { options, message } = await getAuthenticationOptions(email)
			if (!options) {
				throw new Error(`検証オプションの取得に失敗しました: ${message}`)
			}

			const cred = await startAuthentication({ optionsJSON: options })
			const { verified, message: verificationMessage } = await verifyAuthentication(email, cred)
			if (!verified) {
				throw new Error(`パスキー検証の検証に失敗しました: ${verificationMessage}`)
			}

			toast.info("パスキー検証に成功しました")
		} catch (error) {
			toast.error(`パスキー検証中にエラーが発生しました: ${error}`)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 text-lg font-bold">
				<Fingerprint className="h-5 w-5" />
				パスキー検証
			</div>

			<div className="flex justify-between items-center max-w-3xl gap-8 bg-background px-8 py-4 rounded-md">
				<p className="text-gray-200">パスキー検証画面を表示します。</p>
				<Button size="lg" className="rounded-xl shadow-sm" onClick={handleVerify} disabled={isLoading}>
					パスキー検証
				</Button>
			</div>
		</div>
	)
}
