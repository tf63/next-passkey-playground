'use client'

import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

import {
    getAuthenticationOptions,
    getRegistrationOptions,
    verifyAuthentication,
    verifyRegistration,
} from './actions/auth'

const username = 'alice'

export default function Page() {
    const register = async () => {
        const options = await getRegistrationOptions(username)
        const cred = await startRegistration({ optionsJSON: options })
        const result = await verifyRegistration(username, cred)
        alert(result.verified ? '登録成功' : '登録失敗')
    }

    const login = async () => {
        const options = await getAuthenticationOptions(username)
        const cred = await startAuthentication({ optionsJSON: options })
        const result = await verifyAuthentication(username, cred)
        alert(result.verified ? 'ログイン成功' : 'ログイン失敗')
    }

    return (
        <main className="space-y-4 p-4">
            <button type="button" onClick={register} className="rounded bg-blue-500 px-4 py-2 text-white">
                Register
            </button>
            <button type="button" onClick={login} className="rounded bg-green-500 px-4 py-2 text-white">
                Login
            </button>
        </main>
    )
}
