// 実験用のインメモリDB
// 実際のサービスでは、永続化されたDBを使用する
import "server-only"

import type { AuthenticatorTransportFuture, Base64URLString, CredentialDeviceType } from "@simplewebauthn/server"

// ----------------------------------------------------------------
// User
// ----------------------------------------------------------------
export type User = {
	id: string
	email: string
	hashedPassword: string
}
const userDB: User[] = []

export function createUser(email: string, hashedPassword: string) {
	userDB.push({ id: `${userDB.length}`, email, hashedPassword })
}
export function getUserByEmail(email: string) {
	const userWithCredential = userDB.find((user) => user.email === email)
	if (!userWithCredential) return undefined
	const user = { id: userWithCredential.id, email: userWithCredential.email }
	return user
}
export function getUserByID(id: string) {
	const userWithCredential = userDB.find((user) => user.id === id)
	if (!userWithCredential) return undefined
	const user = { id: userWithCredential.id, email: userWithCredential.email }
	return user
}
export function getUserByEmailWithCredential(email: string) {
	return userDB.find((user) => user.email === email)
}
// ----------------------------------------------------------------
// Passkey
// ----------------------------------------------------------------
/**
 * It is strongly advised that credentials get their own DB
 * table, ideally with a foreign key somewhere connecting it
 * to a specific User.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
export type Passkey = {
	// SQL: Store as `TEXT`. Index this column
	id: Base64URLString
	// SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
	//      Caution: Node ORM's may map this to a Buffer on retrieval,
	//      convert to Uint8Array as necessary
	publicKey: Uint8Array<ArrayBuffer>
	// SQL: Foreign Key to an instance of your internal user model
	userID: string
	// SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
	//      (webAuthnUserID + user) also achieves maximum user privacy
	webAuthnUserID: Base64URLString
	// SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
	counter: number
	// SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
	// Ex: 'singleDevice' | 'multiDevice'
	deviceType: CredentialDeviceType
	// SQL: `BOOL` or whatever similar type is supported
	backedUp: boolean
	// SQL: `VARCHAR(255)` and store string array as a CSV string
	// Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
	transports?: AuthenticatorTransportFuture[]
}
const passkeyDB: Passkey[] = []

export function getUserPasskeys(userID: string) {
	return passkeyDB.filter((passkey) => passkey.userID === userID)
}
export function getPasskeyByID(passkeyID: Base64URLString) {
	return passkeyDB.find((passkey) => passkey.id === passkeyID)
}
export function createPasskey(passkey: Passkey) {
	passkeyDB.push(passkey)
}
export function savePasskey(passkey: Passkey) {
	const existingIndex = passkeyDB.findIndex((p) => p.id === passkey.id)
	if (existingIndex === -1) {
		passkeyDB.push(passkey)
		return
	}
	passkeyDB[existingIndex] = passkey
}

// ----------------------------------------------------------------
// Passkey Options Data
// ----------------------------------------------------------------
type RegistrationChallenge = { challengeStr: string; userID: string }
type AuthenticationChallenge = { challengeStr: string; sessionID: string }
const passkeyRegistrationChallengeStore: Map<string, RegistrationChallenge> = new Map()
const passkeyAuthenticationChallengeStore: Map<string, AuthenticationChallenge> = new Map()

export function getPasskeyRegistrationChallengeByUserID(userID: string) {
	const challenge = passkeyRegistrationChallengeStore.get(userID)
	return challenge
}
export function setPasskeyRegistrationChallenge({ challengeStr, userID }: RegistrationChallenge) {
	passkeyRegistrationChallengeStore.set(userID, { challengeStr, userID })
}
export function deletePasskeyRegistrationChallengeByUserID(userID: string) {
	passkeyRegistrationChallengeStore.delete(userID)
}
export function getPasskeyAuthenticationChallengeBySessionID(sessionID: string) {
	return passkeyAuthenticationChallengeStore.get(sessionID)
}
export function setPasskeyAuthenticationChallenge({ challengeStr, sessionID }: AuthenticationChallenge) {
	passkeyAuthenticationChallengeStore.set(sessionID, { challengeStr, sessionID })
}
export function deletePasskeyAuthenticationChallengeBySessionID(sessionID: string) {
	passkeyAuthenticationChallengeStore.delete(sessionID)
}
