import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

async function getUser({ email }: { email: string }) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
    return { id: 'xxxxxxxx', email }
}

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
                if (credentials?.email == null || credentials?.password == null) {
                    return null
                }

                // TODO: パスワードを検証する
                const user = await getUser({ email: credentials.email as string })
                if (!user) return null

                // const isValid = await bcrypt.compare(credentials.password, user.password)
                // if (!isValid) return null

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
