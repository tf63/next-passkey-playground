"use server"

import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser"
import {
	type AuthenticationResponseJSON,
	generateAuthenticationOptions,
	type VerifiedAuthenticationResponse,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import { cookies } from "next/headers"
import { ORIGIN, RP_ID } from "./const"
import {
	deletePasskeyAuthenticationChallengeBySessionID,
	getPasskeyAuthenticationChallengeBySessionID,
	getPasskeyByID,
	getUserByEmail,
	getUserPasskeys,
	savePasskey,
	setPasskeyAuthenticationChallenge,
} from "@/lib/db/memory"

export async function getAuthenticationOptions(email: string): Promise<{
	options: PublicKeyCredentialRequestOptionsJSON | null
	message: string
}> {
	// Retrieve the logged-in user
	const user = getUserByEmail(email)
	if (!user) return { options: null, message: "User not found" }

	// Retrieve any of the user's previously-
	// registered authenticators
	const userPasskeys = getUserPasskeys(user.id)

	const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
		rpID: RP_ID,
		// Require users to use a previously-registered authenticator
		allowCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			transports: passkey.transports,
		})),
	})

	// セッションを作成
	const sessionID = crypto.randomUUID()
	const cookieStore = await cookies()
	cookieStore.set("passkey_session_id", sessionID, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
	})

	// Remember this challenge for this user
	setPasskeyAuthenticationChallenge({ challengeStr: options.challenge, sessionID })

	console.log("=============================================")
	console.log("[Client -> Server] ① パスキー検証オプションの作成")
	console.log(options)

	return { options, message: "Authentication options generated" }
}

export async function verifyAuthentication(
	email: string,
	body: AuthenticationResponseJSON
): Promise<{
	verified: boolean
	message: string
	user: { id: string; email: string } | null
}> {
	console.log("=============================================")
	console.log("[Client -> Server] ② パスキー検証リクエスト")
	console.log(body)

	// Retrieve the logged-in user
	const user = getUserByEmail(email)
	if (!user) return { verified: false, message: "User not found", user: null }

	// Get `options.challenge` that was saved above
	const cookieStore = await cookies()
	const sessionID = cookieStore.get("passkey_session_id")?.value
	if (!sessionID) return { verified: false, message: "Session ID not found", user: null }

	const currentChallenge = getPasskeyAuthenticationChallengeBySessionID(sessionID)
	if (!currentChallenge) return { verified: false, message: "Authentication request not found", user: null }

	// (Pseudocode} Retrieve a passkey from the DB that
	// should match the `id` in the returned credential
	const passkey = getPasskeyByID(body.id)
	if (!passkey) return { verified: false, message: "Passkey not found", user: null }

	let verification: VerifiedAuthenticationResponse
	try {
		verification = await verifyAuthenticationResponse({
			response: body,
			expectedChallenge: currentChallenge.challengeStr,
			expectedOrigin: ORIGIN,
			expectedRPID: RP_ID,
			credential: {
				id: passkey.id,
				publicKey: passkey.publicKey,
				counter: passkey.counter,
				transports: passkey.transports,
			},
		})
	} catch {
		return { verified: false, message: "Could not verify authentication", user: null }
	}

	const { verified, authenticationInfo } = verification
	if (!verified) return { verified: false, message: "Could not verify authentication", user: null }

	console.log("=============================================")
	console.log("[Server -> Server] ③ パスキー検証検証結果")
	console.log(authenticationInfo)

	// NOTE: 一部のパスキー（特にクラウド同期されるタイプ、例：AppleやGoogleのパスキー）はカウンタを更新しない場合がある
	const { newCounter } = authenticationInfo
	if (newCounter < passkey.counter) {
		return { verified: false, message: "Counter mismatch", user: null }
	}
	passkey.counter = newCounter
	savePasskey(passkey)

	console.log("=============================================")
	console.log(`[Server -> Server] ④ パスキーのカウンタを更新`)
	console.log(passkey)

	console.log("=============================================")
	console.log("[Server -> Client] ⑤ 検証成功")
	console.log(user)

	deletePasskeyAuthenticationChallengeBySessionID(sessionID)
	return { verified: true, message: "Authentication successful", user }
}
