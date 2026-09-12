import mongoose from 'mongoose'
import { mongoUri } from './env.js'
import dns from 'node:dns'

dns.setServers(['1.1.1.1', '8.8.8.8'])

async function connectDB() {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(mongoUri)
    console.log(`[db] connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
  } catch (err) {
    console.error('[db] connection failed:', err.message)
    process.exit(1)
  }
}

export default connectDB