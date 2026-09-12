import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import sanitizeUser from '../utils/sanitizeUser.js'
import authService from '../services/authService.js'

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
  } = req.body

  if (!name?.trim()) {
    throw ApiError.badRequest(
      'Name is required'
    )
  }

  if (!email?.trim()) {
    throw ApiError.badRequest(
      'Email is required'
    )
  }

  if (!password || password.length < 6) {
    throw ApiError.badRequest(
      'Password must be at least 6 characters'
    )
  }

  const { user, token } =
    await authService.registerUser({
      name,
      email,
      password,
      phone,
    })

  res.status(201).json({
    user,
    token,
  })
})

const login = asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body

  if (!email || !password) {
    throw ApiError.badRequest(
      'Email and password are required'
    )
  }

  const { user, token } =
    await authService.loginUser({
      email,
      password,
    })

  res.json({
    user,
    token,
  })
})

const me = asyncHandler(async (req, res) => {
  res.json({
    user: sanitizeUser(req.user),
  })
})

const logout = asyncHandler(async (req, res) => {
  res.json({
    message: 'Logged out',
  })
})

const updateProfile = asyncHandler(
  async (req, res) => {
    const {
      name,
      phone,
      address,
    } = req.body

    const user =
      await authService.updateUserProfile(
        req.user._id,
        {
          name,
          phone,
          address,
        }
      )

    res.json({
      user,
    })
  }
)

// ---------------------------------------
// Change password
// ---------------------------------------

const changePassword = asyncHandler(
  async (req, res) => {
    const {
      currentPassword,
      newPassword,
    } = req.body

    const result =
      await authService.changeUserPassword(
        req.user._id,
        {
          currentPassword,
          newPassword,
        }
      )

    res.json(result)
  }
)

export {
  register,
  login,
  me,
  logout,
  updateProfile,
  changePassword,
}