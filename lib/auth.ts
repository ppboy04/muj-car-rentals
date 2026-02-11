import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { authenticateFallbackUser } from "./auth-fallback"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            return null
          }

          // Enforce @jaipur.manipal.edu email domain only for regular users
          if (user.role === 'user' && !credentials.email.endsWith('@jaipur.manipal.edu')) {
            console.log('❌ Regular users must use @jaipur.manipal.edu email:', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            mujId: user.mujId,
            officialEmail: user.officialEmail,
            isOfficial: user.isOfficial,
          }
        } catch (error) {
          console.error("Auth error:", error)
          
          // Fallback to localStorage authentication in development
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Using fallback authentication for login...')
            const fallbackResult = await authenticateFallbackUser(credentials.email, credentials.password)
            
            if (fallbackResult.success && fallbackResult.user) {
              return {
                id: fallbackResult.user.id,
                email: fallbackResult.user.email,
                role: fallbackResult.user.role,
                mujId: fallbackResult.user.mujId,
                officialEmail: fallbackResult.user.officialEmail,
                isOfficial: fallbackResult.user.isOfficial,
              }
            }
          }
          
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.mujId = user.mujId
        token.officialEmail = user.officialEmail
        token.isOfficial = user.isOfficial
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "user" | "admin"
        session.user.mujId = token.mujId as string | undefined
        session.user.officialEmail = token.officialEmail as string | undefined
        session.user.isOfficial = token.isOfficial as boolean | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
}
