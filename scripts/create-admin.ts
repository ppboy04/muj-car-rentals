#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        mujId: null,
        officialEmail: null,
        isOfficial: false,
      }
    })
    
    console.log('✅ Admin user created with non-MUJ email:', adminUser.email)
    console.log('📧 You can now login with: admin@example.com / admin123')
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Admin user already exists with this email')
    } else {
      console.error('Error creating admin:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
