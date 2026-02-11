#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        mujId: true,
        isOfficial: true
      }
    })
    
    console.log('Current users in database:')
    users.forEach(user => {
      console.log(`- ${user.email} (role: ${user.role}, mujId: ${user.mujId || 'none'}, official: ${user.isOfficial})`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
