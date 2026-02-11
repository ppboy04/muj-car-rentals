import "next-auth"

declare module "next-auth" {
  interface User {
    role: "user" | "admin"
    mujId?: string
    officialEmail?: string
    isOfficial?: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      role: "user" | "admin"
      mujId?: string
      officialEmail?: string
      isOfficial?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "user" | "admin"
    mujId?: string
    officialEmail?: string
    isOfficial?: boolean
  }
}
