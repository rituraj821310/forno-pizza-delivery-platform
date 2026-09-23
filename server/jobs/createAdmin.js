import mongoose from 'mongoose'
import readline from 'readline'
import dns from 'dns'

import User from '../models/User.js'
import { mongoUri } from '../config/env.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function createAdmin() {
  try {
    console.log('[admin] Connecting to MongoDB...')

    await mongoose.connect(mongoUri)

    console.log('[admin] MongoDB connected')

    const name = (
      await ask('Admin name: ')
    ).trim()

    const email = (
      await ask('Admin email: ')
    )
      .trim()
      .toLowerCase()

    const password = await ask(
      'Admin password: '
    )

    if (!name) {
      throw new Error(
        'Admin name is required'
      )
    }

    if (!email) {
      throw new Error(
        'Admin email is required'
      )
    }

    if (!password || password.length < 6) {
      throw new Error(
        'Admin password must be at least 6 characters'
      )
    }

    const existingUser =
      await User.findOne({ email })

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(
          '[admin] An admin account with this email already exists.'
        )
      } else {
        console.log(
          '[admin] A user with this email already exists.'
        )

        console.log(
          '[admin] No changes were made.'
        )
      }

      return
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
    })

    console.log(
      '\n[admin] Admin account created successfully!'
    )

    console.log({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })
  } catch (error) {
    console.error(
      '\n[admin] Failed to create admin:',
      error.message
    )

    process.exitCode = 1
  } finally {
    rl.close()

    await mongoose.connection.close()
  }
}

createAdmin()