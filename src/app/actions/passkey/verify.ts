"use server"

import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser"
import {
	type AuthenticationResponseJSON,
	generateAuthenticationOptions,
	type VerifiedAuthenticationResponse,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import { cookies } from "next/headers"
import {
	deletePasskeyAuthenticationChallengeBySessionID,
	getAllUserPasskeys,
	getPasskeyAuthenticationChallengeBySessionID,
	getUserIDByEmail,
	getUserPasskey,
	savePasskey,
	setPasskeyAuthenticationChallenge,
} from "@/lib/db/memory"

// NOTE: 実際には環境変数から読み込む、今回は環境構築をスキップするためにベタ書き
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = "localhost"
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const origin = `http://${rpID}:3168`

export async function getAuthenticationOptions(email: string) {
	// (Pseudocode) Retrieve the logged-in user
	const userID = getUserIDByEmail(email)
	if (!userID) return { options: undefined, message: "User not found" }

	// (Pseudocode) Retrieve any of the user's previously-
	// registered authenticators
	const userPasskeys = getAllUserPasskeys(userID)

	const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
		rpID,
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

	// (Pseudocode) Remember this challenge for this user
	setPasskeyAuthenticationChallenge({ challengeStr: options.challenge, sessionID })

	console.log("=============================================")
	console.log("[Client -> Server] ① パスキー認証オプションの作成")
	console.log(options)

	return { options, message: "Authentication options generated" }
}

export async function verifyAuthentication(email: string, body: AuthenticationResponseJSON) {
	console.log("=============================================")
	console.log("[Client -> Server] ② パスキー認証リクエスト")
	console.log(body)

	// (Pseudocode) Retrieve the logged-in user
	const userID = getUserIDByEmail(email)
	if (!userID) return { verified: false, message: "User not found" }

	// (Pseudocode) Get `options.challenge` that was saved above
	const cookieStore = await cookies()
	const sessionID = cookieStore.get("passkey_session_id")?.value
	if (!sessionID) return { verified: false, message: "Session ID not found" }

	const currentChallenge = getPasskeyAuthenticationChallengeBySessionID(sessionID)
	if (!currentChallenge) return { verified: false, message: "Authentication request not found" }

	// (Pseudocode} Retrieve a passkey from the DB that
	// should match the `id` in the returned credential
	const passkey = getUserPasskey(userID, body.id)
	if (!passkey) return { verified: false, message: "Passkey not found" }

	let verification: VerifiedAuthenticationResponse
	try {
		verification = await verifyAuthenticationResponse({
			response: body,
			expectedChallenge: currentChallenge.challengeStr,
			expectedOrigin: origin,
			expectedRPID: rpID,
			credential: {
				id: passkey.id,
				publicKey: passkey.publicKey,
				counter: passkey.counter,
				transports: passkey.transports,
			},
		})
	} catch (error) {
		console.error(error)
		return { verified: false, message: "Could not verify authentication" }
	}

	const { verified, authenticationInfo } = verification
	if (!verified) return { verified: false, message: "Could not verify authentication" }

	console.log("=============================================")
	console.log("[Server -> Server] ③ パスキー認証検証結果")
	console.log(authenticationInfo)

	// NOTE: 一部のパスキー（特にクラウド同期されるタイプ、例：AppleやGoogleのパスキー）はカウンタを更新しない場合がある
	const { newCounter } = authenticationInfo
	if (newCounter < passkey.counter) {
		return { verified: false, message: "Counter mismatch" }
	}
	passkey.counter = newCounter
	savePasskey(passkey)

	console.log("=============================================")
	console.log(`[Server -> Server] ④ パスキーのカウンタを更新`)
	console.log(passkey)

	deletePasskeyAuthenticationChallengeBySessionID(sessionID)
	return { verified: true, message: "Authentication successful" }
}
