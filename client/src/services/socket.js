import { io } from 'socket.io-client'
import { AUTH_TOKEN_KEY } from '../utils/constants.js'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io('/', {
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
  if (!s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect()
}
