import jwt from 'jsonwebtoken'
import { jwtSecret, jwtExpiresIn } from '../config/env.js'

function generateToken(userId) {
  return jwt.sign(
    { sub: userId },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )
}

export default generateToken