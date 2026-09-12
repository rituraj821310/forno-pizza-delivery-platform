import http from 'http'
import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './sockets/index.js'
import { port } from './config/env.js'
import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])

async function start() {
  await connectDB()

  const httpServer = http.createServer(app)
  initSocket(httpServer)

  httpServer.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`)
  })

  process.on('unhandledRejection', (err) => {
    console.error('[server] unhandled rejection:', err)
    httpServer.close(() => process.exit(1))
  })
}

start()