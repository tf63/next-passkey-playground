'use server'

import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/browser'
import {
    type VerifiedAuthenticationResponse,
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from '@simplewebauthn/server'

import {
    type Passkey,
    type User,
    getCurrentAuthenticationOptions,
    getCurrentRegistrationOptions,
    getUserFromDB,
    getUserPasskey,
    getUserPasskeys,
    saveNewPasskeyInDB,
    saveUpdatedCounter,
    saveUserInDB,
    setCurrentAuthenticationOptions,
    setCurrentRegistrationOptions,
} from '@/lib/db'

/**
 * Human-readable title for your website
 */
const rpName = 'SimpleWebAuthn Example'
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = 'localhost'
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const origin = `http://${rpID}:3000`

export async function getRegistrationOptions(username: string) {
    // (Pseudocode) Retrieve the user from the database
    // after they've logged in
    const user: User = { name: username }

    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    const userPasskeys: Passkey[] = getUserPasskeys(user)

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: user.name,
        // Don't prompt users for additional information about the authenticator
        // (Recommended for smoother UX)
        attestationType: 'none',
        // Prevent users from re-registering existing authenticators
        excludeCredentials: userPasskeys.map((passkey) => ({
            id: passkey.id,
            // Optional
            transports: passkey.transports,
        })),
        // See "Guiding use of authenticators via authenticatorSelection" below
        authenticatorSelection: {
            // Defaults
            residentKey: 'preferred',
            userVerification: 'preferred',
            // Optional
            authenticatorAttachment: 'platform',
        },
    })

    // (Pseudocode) Remember these options for the user
    setCurrentRegistrationOptions(user, options)
    return options
}

export async function verifyRegistration(username: string, body: RegistrationResponseJSON) {
    // (Pseudocode) Retrieve the logged-in user
    const user: User = { name: username }

    // (Pseudocode) Get `options.challenge` that was saved above
    const currentOptions = getCurrentRegistrationOptions(user)
    if (!currentOptions) throw new Error('No registration options found for user')

    // let verification: VerifiedRegistrationResponse
    // try {
    const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    })
    // } catch (error) {
    //     console.error(error)
    //     return { verified: false }
    // }

    const { verified, registrationInfo } = verification

    if (!verified || !registrationInfo) throw new Error('Registration verification failed')
    const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo

    const newPasskey = {
        // `user` here is from Step 2
        user,
        // Created by `generateRegistrationOptions()` in Step 1
        webAuthnUserID: currentOptions.user.id,
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
    saveNewPasskeyInDB(newPasskey)
    saveUserInDB(user)

    return { verified: true }
}

export async function getAuthenticationOptions(username: string) {
    // (Pseudocode) Retrieve the logged-in user
    const user = getUserFromDB(username)
    if (!user) throw new Error('User not found')

    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    const userPasskeys: Passkey[] = getUserPasskeys(user)

    const options = await generateAuthenticationOptions({
        rpID,
        // Require users to use a previously-registered authenticator
        allowCredentials: userPasskeys.map((passkey) => ({
            id: passkey.id,
            transports: passkey.transports,
        })),
    })

    // (Pseudocode) Remember this challenge for this user
    setCurrentAuthenticationOptions(user, options)

    return options
}

export async function verifyAuthentication(username: string, body: AuthenticationResponseJSON) {
    // (Pseudocode) Retrieve the logged-in user
    const user = getUserFromDB(username)
    if (!user) return { verified: false }

    // (Pseudocode) Get `options.challenge` that was saved above
    const currentOptions = getCurrentAuthenticationOptions(user)
    if (!currentOptions) return { verified: false }

    // (Pseudocode} Retrieve a passkey from the DB that
    // should match the `id` in the returned credential
    const passkey = getUserPasskey(user, body.id)
    if (!passkey) return { verified: false }

    let verification: VerifiedAuthenticationResponse
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: currentOptions.challenge,
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
        return { verified: false }
    }

    const { verified, authenticationInfo } = verification
    if (!verified) return { verified: false }

    const { newCounter } = authenticationInfo
    saveUpdatedCounter(passkey, newCounter)
    return { verified: true }
}
