import dns from 'node:dns'
import mongoose from 'mongoose'

import User from '../models/User.js'
import { mongoUri } from '../config/env.js'

dns.setServers([
  '1.1.1.1',
  '8.8.8.8',
])

const ADMIN_EMAIL = 'admin@forno.com'
const ADMIN_PASSWORD = 'Admin@123456'

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUri)

    console.log('[admin] connected to MongoDB')

    let admin = await User.findOne({
      email: ADMIN_EMAIL,
    })

    if (admin) {
      admin.name = 'Forno Admin'
      admin.password = ADMIN_PASSWORD
      admin.role = 'admin'

      await admin.save()

      console.log(
        `[admin] admin account updated: ${ADMIN_EMAIL}`
      )
    } else {
      admin = await User.create({
        name: 'Forno Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      })

      console.log(
        `[admin] admin account created: ${ADMIN_EMAIL}`
      )
    }
  } catch (error) {
    console.error(
      '[admin] seed failed:',
      error
    )

    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedAdmin()