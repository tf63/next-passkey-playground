"use server"

import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/browser"
import {
	generateRegistrationOptions,
	type RegistrationResponseJSON,
	type VerifiedRegistrationResponse,
	verifyRegistrationResponse,
} from "@simplewebauthn/server"
import {
	createUserPasskey,
	getAllUserPasskeys,
	getPasskeyRegistration,
	getUserIDByEmail,
	type Passkey,
	setPasskeyRegistration,
} from "@/lib/db/memory"

/**
 * Human-readable title for your website
 */
const rpName = "SimpleWebAuthn Example"
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

type RegisterationOptionsResponse = {
	options: PublicKeyCredentialCreationOptionsJSON | undefined
	message: string
}
export async function getRegistrationOptions(email: string): Promise<RegisterationOptionsResponse> {
	// (Pseudocode) Retrieve the user from the database
	// after they've logged in
	const userID = getUserIDByEmail(email)
	if (!userID) return { options: undefined, message: "User not found" }

	// (Pseudocode) Retrieve any of the user's previously-
	// registered authenticators
	const userPasskeys = getAllUserPasskeys(userID)

	const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
		rpName,
		rpID,
		userName: email,
		// Don't prompt users for additional information about the authenticator
		// (Recommended for smoother UX)
		attestationType: "none",
		// Prevent users from re-registering existing authenticators
		excludeCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			// Optional
			transports: passkey.transports,
		})),
		// See "Guiding use of authenticators via authenticatorSelection" below
		authenticatorSelection: {
			// Defaults
			residentKey: "preferred",
			userVerification: "preferred",
			// Optional
			authenticatorAttachment: "platform",
		},
	})

	// (Pseudocode) Remember these options for the user
	setPasskeyRegistration(userID, options)

	console.log("=============================================")
	console.log("① パスキー登録オプションの作成")
	console.log(options)
	console.log("=============================")
	return { options, message: "パスキー登録オプションを取得しました" }
}

export async function verifyRegistration(email: string, body: RegistrationResponseJSON) {
	// (Pseudocode) Retrieve the logged-in user
	const userID = getUserIDByEmail(email)
	if (!userID) return { verified: false, message: "User not found" }

	// (Pseudocode) Get `options.challenge` that was saved above
	const currentOptions = getPasskeyRegistration(userID)
	if (!currentOptions) return { verified: false, message: "Registration options not found" }

	let verification: VerifiedRegistrationResponse
	try {
		verification = await verifyRegistrationResponse({
			response: body,
			expectedChallenge: currentOptions.options.challenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
		})
	} catch (error) {
		console.error(error)
		return { verified: false, message: "Registration verification failed" }
	}

	const { verified, registrationInfo } = verification
	if (!verified || !registrationInfo) {
		return { verified: false, message: "Registration not verified" }
	}

	const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo

	const newPasskey = {
		// `user` here is from Step 2
		userID: userID,
		// Created by `generateRegistrationOptions()` in Step 1
		webAuthnUserID: currentOptions.options.user.id,
		// A unique identifier for the credential
		id: credential.id,
		// The public key bytes, used for subsequent authentication signature verification
		publicKey: credential.publicKey,
		// The number of times the authenticator has been used on this site so far
		counter: credential.counter,
		// How the browser can talk with this credential's authenticator
		transports: credential.transports,
		// Whether the passkey is single-device or multi-device
		deviceType: credentialDeviceType,
		// Whether the passkey has been backed up in some way
		backedUp: credentialBackedUp,
	} satisfies Passkey

	// (Pseudocode) Save the authenticator info so that we can
	// get it by user ID later
	createUserPasskey(newPasskey)

	console.log("=============================================")
	console.log("② 認証情報の保存")
	console.log(newPasskey)
	console.log("=============================================")
	return { verified: true, message: "Registration verified and passkey saved" }
}
