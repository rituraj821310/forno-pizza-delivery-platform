import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import generateToken from '../utils/generateToken.js'
import sanitizeUser from '../utils/sanitizeUser.js'

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
  updateUserProfile,
  changeUserPassword,
}

export default authService