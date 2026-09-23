import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import generateToken from '../utils/generateToken.js'
import sanitizeUser from '../utils/sanitizeUser.js'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import PasswordReset from '../models/PasswordReset.js'
import generateOTP from '../utils/generateOTP.js'
import { sendPasswordResetOTP } from './emailService.js'

async function registerUser({
  name,
  email,
  password,
  phone,
}) {
  const normalizedEmail = email.toLowerCase().trim()

  const existing = await User.findOne({
    email: normalizedEmail,
  })

  if (existing) {
    throw ApiError.conflict(
      'An account with that email already exists'
    )
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone,
  })

  const token = generateToken(user._id)

  return {
    user: sanitizeUser(user),
    token,
  }
}

async function loginUser({
  email,
  password,
}) {
  const normalizedEmail = email.toLowerCase().trim()

  // password has select:false in User model,
  // so explicitly select it for login.
  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password')

  if (!user) {
    throw ApiError.unauthorized(
      'Invalid email or password'
    )
  }

  const isPasswordValid =
    await user.comparePassword(password)

  if (!isPasswordValid) {
    throw ApiError.unauthorized(
      'Invalid email or password'
    )
  }

  const token = generateToken(user._id)

  return {
    user: sanitizeUser(user),
    token,
  }
}

async function requestPasswordReset(email) {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await User.findOne({
    email: normalizedEmail,
  })

  // Don't reveal whether the email exists.
  if (!user) {
    return {
      message:
        'If an account exists with this email, a password reset OTP has been sent.',
    }
  }

  // Remove any previous reset requests for this user.
  await PasswordReset.deleteMany({
    userId: user._id,
  })

  // Generate a new 6-digit OTP.
  const otp = generateOTP()

  // Hash OTP before storing it.
  const otpHash = await bcrypt.hash(otp, 10)

  // OTP expires in 5 minutes.
  const expiresAt = new Date(
    Date.now() + 5 * 60 * 1000
  )

  await PasswordReset.create({
    userId: user._id,
    otpHash,
    expiresAt,
  })

  await sendPasswordResetOTP(
    user.email,
    otp
  )

  return {
    message:
      'If an account exists with this email, a password reset OTP has been sent.',
  }
}

async function verifyResetOTP({
  email,
  otp,
}) {
  const normalizedEmail =
    email.toLowerCase().trim()

  const user = await User.findOne({
    email: normalizedEmail,
  })

  if (!user) {
    throw ApiError.badRequest(
      'Invalid or expired OTP'
    )
  }

  const resetRequest =
    await PasswordReset.findOne({
      userId: user._id,
    })

  if (!resetRequest) {
    throw ApiError.badRequest(
      'Invalid or expired OTP'
    )
  }

  if (resetRequest.used) {
    throw ApiError.badRequest(
      'This OTP has already been used'
    )
  }

  if (
    resetRequest.expiresAt.getTime() <
    Date.now()
  ) {
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    })

    throw ApiError.badRequest(
      'OTP has expired'
    )
  }

  // Maximum 5 incorrect attempts.
  if (resetRequest.attempts >= 5) {
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    })

    throw ApiError.tooManyRequests(
      'Too many incorrect OTP attempts'
    )
  }

  const isOTPValid =
    await bcrypt.compare(
      otp,
      resetRequest.otpHash
    )

  if (!isOTPValid) {
    resetRequest.attempts += 1

    await resetRequest.save()

    throw ApiError.badRequest(
      'Invalid OTP'
    )
  }

  // Generate a temporary reset token.
  const resetToken =
    crypto.randomBytes(32).toString('hex')

  const resetTokenHash =
    crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

  resetRequest.resetTokenHash =
    resetTokenHash

  resetRequest.verifiedAt =
    new Date()

  await resetRequest.save()

  return {
    resetToken,
  }
}

async function resetPassword({
  email,
  resetToken,
  newPassword,
}) {
  const normalizedEmail =
    email.toLowerCase().trim()

  if (!newPassword) {
    throw ApiError.badRequest(
      'New password is required'
    )
  }

  if (newPassword.length < 6) {
    throw ApiError.badRequest(
      'New password must be at least 6 characters'
    )
  }

  const user = await User.findOne({
    email: normalizedEmail,
  })

  if (!user) {
    throw ApiError.badRequest(
      'Invalid or expired reset request'
    )
  }

  const resetTokenHash =
    crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

  const resetRequest =
    await PasswordReset.findOne({
      userId: user._id,
      resetTokenHash,
    })

  if (!resetRequest) {
    throw ApiError.badRequest(
      'Invalid or expired reset request'
    )
  }

  if (!resetRequest.verifiedAt) {
    throw ApiError.badRequest(
      'OTP verification is required'
    )
  }

  if (resetRequest.used) {
    throw ApiError.badRequest(
      'This reset request has already been used'
    )
  }

  if (
    resetRequest.expiresAt.getTime() <
    Date.now()
  ) {
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    })

    throw ApiError.badRequest(
      'Reset request has expired'
    )
  }

  user.password = newPassword

  await user.save()

  resetRequest.used = true
  await resetRequest.save()

  return {
    message: 'Password reset successfully',
  }
}

async function updateUserProfile(
  userId,
  {
    name,
    phone,
    address,
  }
) {
  const user = await User.findById(userId)

  if (!user) {
    throw ApiError.notFound(
      'User not found'
    )
  }

  if (name !== undefined) {
    if (!name.trim()) {
      throw ApiError.badRequest(
        'Name cannot be empty'
      )
    }

    user.name = name.trim()
  }

  if (phone !== undefined) {
    user.phone = phone
  }

  if (address !== undefined) {
    user.address = {
      ...user.address?.toObject?.(),
      ...address,
    }
  }

  await user.save()

  return sanitizeUser(user)
}

// ---------------------------------------
// Change password
// ---------------------------------------

async function changeUserPassword(
  userId,
  {
    currentPassword,
    newPassword,
  }
) {
  if (!currentPassword) {
    throw ApiError.badRequest(
      'Current password is required'
    )
  }

  if (!newPassword) {
    throw ApiError.badRequest(
      'New password is required'
    )
  }

  if (newPassword.length < 6) {
    throw ApiError.badRequest(
      'New password must be at least 6 characters'
    )
  }

  if (currentPassword === newPassword) {
    throw ApiError.badRequest(
      'New password must be different from your current password'
    )
  }

  const user = await User.findById(userId)
    .select('+password')

  if (!user) {
    throw ApiError.notFound(
      'User not found'
    )
  }

  const isCurrentPasswordValid =
    await user.comparePassword(currentPassword)

  if (!isCurrentPasswordValid) {
    throw ApiError.unauthorized(
      'Current password is incorrect'
    )
  }

  user.password = newPassword

  await user.save()

  return {
    message: 'Password changed successfully',
  }
}

const authService = {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
  updateUserProfile,
  changeUserPassword,
}

export default authService