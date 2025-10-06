"use server"

import type { AuthenticationResponseJSON } from "@simplewebauthn/browser"
import { signIn } from "@/auth"

export async function passkeySignInAction({ cred }: { cred: AuthenticationResponseJSON }) {
	try {
		await signIn("passkey", {
			redirect: false,
			cred: JSON.stringify(cred),
		})

		return { success: true, message: "パスキー認証に成功しました" }
	} catch (error) {
		return { success: false, message: `パスキー認証中にエラーが発生しました: ${error}` }
	}
}
