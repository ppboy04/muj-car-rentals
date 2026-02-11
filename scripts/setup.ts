#!/usr/bin/env tsx

/**
 * Setup script for MUJ Car Rentals
 * 
 * This script will:
 * 1. Start Prisma dev server
 * 2. Push database schema
 * 3. Run data migration
 * 
 * Usage: npm run setup
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runCommand(command: string, description: string) {
  console.log(`🔄 ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command)
    if (stderr && !stderr.includes('warn')) {
      console.error('Error:', stderr)
    }
    if (stdout) {
      console.log(stdout)
    }
    console.log(`✅ ${description} completed`)
    return true
  } catch (error) {
    console.error(`❌ ${description} failed:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Setting up MUJ Car Rentals backend...')
  
  try {
    // 1. Generate Prisma client
    await runCommand('npx prisma generate', 'Generating Prisma client')
    
    // 2. Try to push database schema
    const dbPushSuccess = await runCommand('npx prisma db push', 'Pushing database schema')
    
    if (dbPushSuccess) {
      // 3. Run migration script if db push was successful
      await runCommand('npm run migrate-data', 'Running data migration')
      
      console.log('\n🎉 Setup completed successfully!')
      console.log('\n📋 Next steps:')
      console.log('1. Run `npm run dev` to start the development server')
      console.log('2. Visit http://localhost:3000')
      console.log('3. Login with:')
      console.log('   - Admin: admin@example.com / admin123')
      console.log('   - User: student@jaipur.manipal.edu / user123')
    } else {
      console.log('\n⚠️  Database setup failed. You can still run the app, but you\'ll need to:')
      console.log('1. Start your PostgreSQL database')
      console.log('2. Run `npm run db:push` to create tables')
      console.log('3. Run `npm run migrate-data` to seed data')
      console.log('4. Run `npm run dev` to start the app')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

main()
