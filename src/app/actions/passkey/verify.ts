"use server"

import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser"
import {
	type AuthenticationResponseJSON,
	generateAuthenticationOptions,
	type VerifiedAuthenticationResponse,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import {
	createPasskeyAuthentication,
	getAllUserPasskeys,
	getPasskeyAuthentication,
	getUserIDByEmail,
	getUserPasskey,
	updateUserPasskeyCounter,
} from "@/lib/db/memory"

/**
 * Human-readable title for your website
 */
// const rpName = "SimpleWebAuthn Example"
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
const origin = `http://${rpID}:3005`

export async function getAuthenticationOptions(email: string) {
	// (Pseudocode) Retrieve the logged-in user
	const userID = getUserIDByEmail(email)
	if (!userID) return { options: undefined, message: "User not found" }

	// (Pseudocode) Retrieve any of the user's previously-
	// registered authenticators
	const userPasskeys = getAllUserPasskeys(userID)

	const options = (await generateAuthenticationOptions({
		rpID,
		// Require users to use a previously-registered authenticator
		allowCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			transports: passkey.transports,
		})),
	})) as PublicKeyCredentialRequestOptionsJSON

	// (Pseudocode) Remember this challenge for this user
	createPasskeyAuthentication(userID, options)

	console.log("=============================================")
	console.log("① パスキー認証オプションの作成")
	console.log(options)
	console.log("=============================")
	return { options, message: "Authentication options generated" }
}

export async function verifyAuthentication(email: string, body: AuthenticationResponseJSON) {
	// (Pseudocode) Retrieve the logged-in user
	const userID = getUserIDByEmail(email)
	if (!userID) return { verified: false, message: "User not found" }

	// (Pseudocode) Get `options.challenge` that was saved above
	const currentOptions = getPasskeyAuthentication(userID)
	if (!currentOptions) return { verified: false, message: "Authentication request not found" }

	// (Pseudocode} Retrieve a passkey from the DB that
	// should match the `id` in the returned credential
	const passkey = getUserPasskey(userID, body.id)
	if (!passkey) return { verified: false, message: "Passkey not found" }

	let verification: VerifiedAuthenticationResponse
	try {
		verification = await verifyAuthenticationResponse({
			response: body,
			expectedChallenge: currentOptions.options.challenge,
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

	const { newCounter } = authenticationInfo
	updateUserPasskeyCounter(passkey, newCounter)
	return { verified: true, message: "Authentication successful" }
}
