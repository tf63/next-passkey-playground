import type {} from '@simplewebauthn/server'

export type User = {
    id: string
    email: string
    hashedPassword: string
}

export function createUser(email: string, hashedPassword: string) {
    userDB.push({ id: `${userDB.length}`, email, hashedPassword })
}

export function getUserByEmail(email: string) {
    return userDB.find((user) => user.email === email)
}

// export const userDB = new Map<string, User>()
export const userDB: User[] = []

/**
 * It is strongly advised that credentials get their own DB
 * table, ideally with a foreign key somewhere connecting it
 * to a specific User.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
// export type Passkey = {
//     // SQL: Store as `TEXT`. Index this column
//     id: Base64URLString
//     // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
//     //      Caution: Node ORM's may map this to a Buffer on retrieval,
//     //      convert to Uint8Array as necessary
//     publicKey: Uint8Array
//     // SQL: Foreign Key to an instance of your internal user model
//     user: User
//     // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
//     //      (webAuthnUserID + user) also achieves maximum user privacy
//     webAuthnUserID: Base64URLString
//     // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
//     counter: number
//     // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
//     // Ex: 'singleDevice' | 'multiDevice'
//     deviceType: CredentialDeviceType
//     // SQL: `BOOL` or whatever similar type is supported
//     backedUp: boolean
//     // SQL: `VARCHAR(255)` and store string array as a CSV string
//     // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
//     transports?: AuthenticatorTransportFuture[]
// }

// export function getUserFromDB(username: string) {
//     return userDB.get(username)
// }
// export function saveUserInDB(user: User) {
//     userDB.set(user.name, user)
// }

// export function getUserPasskeys(user: User) {
//     return Array.from(passkeyDB.values()).filter((passkey) => passkey.user.name === user.name)
// }
// export function getUserPasskey(user: User, passkeyId: Base64URLString) {
//     return Array.from(passkeyDB.values()).find(
//         (passkey) => passkey.user.name === user.name && passkey.id === passkeyId
//     )
// }
// export function saveNewPasskeyInDB(passkey: Passkey) {
//     passkeyDB.set(passkey.id, passkey)
// }
// export function saveUpdatedCounter(passkey: Passkey, counter: number) {
//     const existingPasskey = passkeyDB.get(passkey.id)
//     if (existingPasskey) {
//         existingPasskey.counter = counter
//         passkeyDB.set(passkey.id, existingPasskey)
//     }
// }

// export function setCurrentRegistrationOptions(user: User, options: PublicKeyCredentialCreationOptionsJSON) {
//     userRegistrationDB.set(user.name, options)
// }
// export function getCurrentRegistrationOptions(user: User): PublicKeyCredentialCreationOptionsJSON | undefined {
//     return userRegistrationDB.get(user.name)
// }

// export function setCurrentAuthenticationOptions(user: User, options: PublicKeyCredentialRequestOptionsJSON) {
//     userAuthenticationDB.set(user.name, options)
// }
// export function getCurrentAuthenticationOptions(user: User): PublicKeyCredentialRequestOptionsJSON | undefined {
//     return userAuthenticationDB.get(user.name)
// }

// const passkeyDB = new Map<string, Passkey>()

// const userRegistrationDB = new Map<string, PublicKeyCredentialCreationOptionsJSON>()
// const userAuthenticationDB = new Map<string, PublicKeyCredentialRequestOptionsJSON>()
