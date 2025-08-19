'use server'

import { signIn } from '@/auth'

export async function signInAction({ email, password }: { email: string; password: string }) {
    await signIn('credentials', {
        redirect: true,
        email,
        password,
        redirectTo: '/',
    })
}
