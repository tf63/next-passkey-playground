import type { AuthenticationResponseJSON } from "@simplewebauthn/browser"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyAuthentication } from "@/app/actions/passkey/verify-discoverable"
import { getUserByEmailWithCredential } from "@/lib/db/memory"

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id: string
			email: string
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				if (credentials?.email == null || credentials?.password == null) {
					return null
				}

				const email = credentials.email as string
				const password = credentials.password as string

				const user = getUserByEmailWithCredential(email)
				if (!user) return null

				const isValid = await bcrypt.compare(password, user.hashedPassword)
				if (!isValid) return null

				return { id: user.id, email: user.email }
			},
		}),
		Credentials({
			id: "passkey",
			name: "Passkey",
			credentials: {
				cred: { label: "PasskeyCredential", type: "text" },
			},
			authorize: async (credentials) => {
				if (credentials?.cred == null) return null

				const cred: AuthenticationResponseJSON = JSON.parse(credentials.cred as string)

				const { verified, user } = await verifyAuthentication(cred)
				if (!verified || !user) {
					return null
				}

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
		signIn: "/sign-in",
	},
})
