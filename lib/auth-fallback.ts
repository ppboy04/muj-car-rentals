// Fallback authentication for development when database is not available
import bcrypt from 'bcryptjs'

const USERS_KEY = 'muj_users_fallback'

interface FallbackUser {
  id: string
  email: string
  password: string
  role: 'user' | 'admin'
  mujId?: string
  officialEmail?: string
  isOfficial: boolean
  createdAt: string
}

import { promises as fs } from 'fs'
import path from 'path'

const FALLBACK_FILE = path.join(process.cwd(), '.fallback-users.json')
const isBrowser = typeof window !== 'undefined'

// In-memory storage for server-side fallback
let memoryUsers: FallbackUser[] | null = null

export async function getFallbackUsers(): Promise<FallbackUser[]> {
  // For browser (client-side), use localStorage
  if (isBrowser) {
    const stored = localStorage.getItem(USERS_KEY)
    if (!stored) {
      const defaultUsers = getDefaultUsers()
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
      return defaultUsers
    }
    
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultUsers()
    }
  }
  
  // For server-side, use memory storage first, then try file system
  if (memoryUsers) {
    return memoryUsers
  }
  
  try {
    const fileContent = await fs.readFile(FALLBACK_FILE, 'utf-8')
    memoryUsers = JSON.parse(fileContent)
    return memoryUsers
  } catch {
    // File doesn't exist or is invalid, use defaults
    memoryUsers = getDefaultUsers()
    await saveFallbackUsers(memoryUsers)
    return memoryUsers
  }
}

export async function saveFallbackUsers(users: FallbackUser[]) {
  // Update memory storage
  memoryUsers = users
  
  // For browser, use localStorage
  if (isBrowser) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return
  }
  
  // For server, save to file
  try {
    await fs.writeFile(FALLBACK_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Failed to save fallback users to file:', error)
  }
}

export async function createFallbackUser(
  email: string,
  password: string,
  mujId?: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ success: boolean; message: string; user?: FallbackUser }> {
  try {
    // Enforce @jaipur.manipal.edu email domain only for regular users
    if (role === 'user' && !email.endsWith('@jaipur.manipal.edu')) {
      return { success: false, message: 'Regular users must use @jaipur.manipal.edu emails' }
    }

    const users = await getFallbackUsers()
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'User already exists' }
    }
    
    // Check MUJ ID conflict
    if (mujId && users.find(u => u.mujId === mujId)) {
      return { success: false, message: 'MUJ ID already registered' }
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    const isOfficial = email.endsWith('@jaipur.manipal.edu')
    
    const newUser: FallbackUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email,
      password: hashedPassword,
      role,
      mujId,
      officialEmail: isOfficial ? email : undefined,
      isOfficial,
      createdAt: new Date().toISOString(),
    }
    
    users.push(newUser)
    saveFallbackUsers(users)
    
    return { success: true, message: 'User created successfully', user: newUser }
  } catch (error) {
    return { success: false, message: 'Registration failed' }
  }
}

export async function authenticateFallbackUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: Omit<FallbackUser, 'password'> }> {
  try {
    const users = await getFallbackUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    // Enforce @jaipur.manipal.edu email domain only for regular users
    if (user.role === 'user' && !email.endsWith('@jaipur.manipal.edu')) {
      return { success: false, message: 'Regular users must use @jaipur.manipal.edu emails' }
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return { success: false, message: 'Invalid credentials' }
    }
    
    const { password: _, ...userWithoutPassword } = user
    return { success: true, message: 'Login successful', user: userWithoutPassword }
  } catch (error) {
    return { success: false, message: 'Login failed' }
  }
}

function getDefaultUsers(): FallbackUser[] {
  return [
    {
      id: 'admin_default',
      email: 'admin@example.com',
      password: '$2a$12$rEHvK7L4H8T2U0qXYp5d2.F4O8lKj3yDx4kP7wLqA2G8v9Ff6h5eS', // admin123
      role: 'admin',
      mujId: undefined,
      officialEmail: undefined,
      isOfficial: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'student_default',
      email: 'student@jaipur.manipal.edu',
      password: '$2a$12$YVxZKw9H8O2P0mSvF3c8n.T1N7jG5kS2Bx8cL6vQm0A9b2Yz3h4dE', // user123
      role: 'user',
      mujId: 'MUJ2024001',
      officialEmail: 'student@jaipur.manipal.edu',
      isOfficial: true,
      createdAt: new Date().toISOString(),
    }
  ]
}
