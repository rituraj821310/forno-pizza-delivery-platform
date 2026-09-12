import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import sanitizeUser from '../utils/sanitizeUser.js'

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })

  res.json({
    users: users.map(sanitizeUser),
  })
})

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body

  if (!['customer', 'admin'].includes(role)) {
    throw ApiError.badRequest(
      'Role must be "customer" or "admin"'
    )
  }

  if (
    req.params.id === req.user._id.toString() &&
    role !== 'admin'
  ) {
    throw ApiError.badRequest(
      'You cannot remove your own admin access'
    )
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  user.role = role

  await user.save()

  res.json({
    user: sanitizeUser(user),
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw ApiError.badRequest(
      'You cannot remove your own account'
    )
  }

  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  res.json({
    message: 'User removed',
    id: req.params.id,
  })
})

export {
  listUsers,
  updateUserRole,
  deleteUser,
}