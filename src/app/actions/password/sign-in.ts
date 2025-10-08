"use server"

import { signIn } from "@/auth"

export async function signInAction({ email, password }: { email: string; password: string }) {
	await new Promise((resolve) => setTimeout(resolve, 1000)) // 待機時間入れておく

	try {
		await signIn("credentials", {
			redirect: false,
			email,
			password,
		})

		return { success: true, message: "パスワード検証に成功しました" }
	} catch {
		return { success: false, message: "パスワード検証に失敗しました" }
	}
}
