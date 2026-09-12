import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { jwtSecret } from '../config/env.js'
import User from '../models/User.js'

// Verifies the bearer token and attaches the full user document to req.user.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''

  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : null

  if (!token) {
    throw ApiError.unauthorized('You must be logged in to do that')
  }

  let payload

  try {
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw ApiError.unauthorized(
      'Your session has expired, please log in again'
    )
  }

  const user = await User.findById(payload.sub)

  if (!user) {
    throw ApiError.unauthorized('Account no longer exists')
  }

  req.user = user
  next()
})

// Must run after protect(). Restricts a route to admin accounts only.
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'))
  }

  next()
}

export { protect, adminOnly }