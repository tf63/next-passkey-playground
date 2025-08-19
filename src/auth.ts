import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { getUserByEmail } from '@/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const email = credentials.email as string
                const password = credentials.password as string

                if (credentials?.email == null || credentials?.password == null) {
                    return null
                }

                const user = getUserByEmail(email)
                if (!user) return null

                const isValid = await bcrypt.compare(password, user.hashedPassword)
                if (!isValid) return null

                return { id: user.id, email: user.email }
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
})
