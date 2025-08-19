'use server'

import bcrypt from 'bcrypt'

import { signIn } from '@/auth'

export async function registerAction({ email, password }: { email: string; password: string }) {
    // TODO: ユーザー登録を実装する
    const _hashed = await bcrypt.hash(password, 10)

    console.log('email:', email)
    console.log('Hashed password:', _hashed)

    await signIn('credentials', {
        email,
        password,
        redirect: true,
        redirectTo: '/',
    })
}
