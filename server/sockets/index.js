import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { clientOrigin, jwtSecret } from '../config/env.js'

let ioInstance = null

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  })

  // Soft auth: decode the token if present so we know who's connecting,
  // but don't reject the handshake — order tracking pages work for guests too.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    if (token) {
      try {
        const payload = jwt.verify(token, jwtSecret)
        socket.userId = payload.sub
      } catch {
        // invalid/expired token — proceed unauthenticated
      }
    }

    next()
  })

  io.on('connection', (socket) => {
    socket.on('order:subscribe', (orderId) => {
      if (typeof orderId === 'string' && orderId.length > 0) {
        socket.join(`order:${orderId}`)
      }
    })

    socket.on('order:unsubscribe', (orderId) => {
      if (typeof orderId === 'string' && orderId.length > 0) {
        socket.leave(`order:${orderId}`)
      }
    })
  })

  ioInstance = io
  return io
}

function getIO() {
  if (!ioInstance) {
    throw new Error(
      'Socket.IO not initialized — call initSocket(server) first'
    )
  }

  return ioInstance
}

// Broadcasts the updated order to anyone tracking it.
function emitOrderUpdate(order) {
  if (!ioInstance) return

  const payload = order.toObject ? order.toObject() : order

  ioInstance
    .to(`order:${order._id}`)
    .emit('order:updated', payload)
}

export { initSocket, getIO, emitOrderUpdate }