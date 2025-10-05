// 実験用のインメモリDB
// 実際のサービスでは、永続化されたDBを使用する

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
	return userDB.find((user) => user.email === email)
}
export function getUserIDByEmail(email: string) {
	const user = userDB.find((user) => user.email === email)
	return user?.id
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

export function getAllUserPasskeys(userID: string) {
	return passkeyDB.filter((passkey) => passkey.userID === userID)
}
export function getUserPasskey(userID: string, passkeyId: Base64URLString) {
	return passkeyDB.find((passkey) => passkey.id === passkeyId && passkey.userID === userID)
}
export function createUserPasskey(passkey: Passkey) {
	passkeyDB.push(passkey)
}
export function updateUserPasskeyCounter(passkey: Passkey, counter: number): void {
	const existingIndex = passkeyDB.findIndex((p) => p.id === passkey.id)
	if (existingIndex === -1) {
		throw new Error(`Passkey with id ${passkey.id} not found`)
	}
	passkeyDB[existingIndex] = { ...passkeyDB[existingIndex], counter }
}
// ----------------------------------------------------------------
// Passkey Data
// ----------------------------------------------------------------
// userIDとoptionsは一対一になる
type PasskeyRegistrationData = { userID: string; options: PublicKeyCredentialCreationOptionsJSON }
type PasskeyAuthenticationData = { userID: string; options: PublicKeyCredentialRequestOptionsJSON }
const passkeyRegistrationDB: PasskeyRegistrationData[] = []
const passkeyAuthenticationDB: PasskeyAuthenticationData[] = []

export function getPasskeyRegistration(userID: string) {
	return passkeyRegistrationDB.find((registration) => registration.userID === userID)
}
export function createPasskeyRegistration(userID: string, options: PublicKeyCredentialCreationOptionsJSON) {
	const data = { userID, options }
	passkeyRegistrationDB.push(data)
}
export function getPasskeyAuthentication(userID: string) {
	return passkeyAuthenticationDB.find((authentication) => authentication.userID === userID)
}
export function createPasskeyAuthentication(userID: string, options: PublicKeyCredentialRequestOptionsJSON) {
	const data = { userID, options }
	passkeyAuthenticationDB.push(data)
}
