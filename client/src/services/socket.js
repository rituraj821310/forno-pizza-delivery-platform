import { io } from 'socket.io-client'
import { AUTH_TOKEN_KEY } from '../utils/constants.js'

let socket = null

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem(AUTH_TOKEN_KEY),
      },
    })
  }

  return socket
}

export function connectSocket() {
  const s = getSocket()

  // Refresh token before connecting
  s.auth = {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
  }

  if (!s.connected) {
    s.connect()
  }

  return s
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
  }
}