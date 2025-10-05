"use server"

import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { createUser, getUserByEmail } from "@/lib/db/memory"

export async function registerAction({ email, password }: { email: string; password: string }) {
	await new Promise((resolve) => setTimeout(resolve, 1000)) // 待機時間入れておく

	const existingUser = getUserByEmail(email)
	if (existingUser) {
		return { success: false, message: "Failed to register" }
	}

	const hashedPassword = await bcrypt.hash(password, 10)
	createUser(email, hashedPassword)

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		})

		return { success: true, message: "Registration successful" }
	} catch {
		return { success: false, message: "Sign-in failed after registration" }
	}
}
