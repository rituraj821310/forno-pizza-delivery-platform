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

const forgotPassword = asyncHandler(
  async (req, res) => {
    const { email } = req.body

    if (!email?.trim()) {
      throw ApiError.badRequest(
        'Email is required'
      )
    }

    const result =
      await authService.requestPasswordReset(
        email
      )

    res.json(result)
  }
)

const verifyResetOTP = asyncHandler(
  async (req, res) => {
    const {
      email,
      otp,
    } = req.body

    if (!email?.trim()) {
      throw ApiError.badRequest(
        'Email is required'
      )
    }

    if (!otp) {
      throw ApiError.badRequest(
        'OTP is required'
      )
    }

    if (!/^\d{6}$/.test(otp)) {
      throw ApiError.badRequest(
        'OTP must be 6 digits'
      )
    }

    const result =
      await authService.verifyResetOTP({
        email,
        otp,
      })

    res.json(result)
  }
)

const resetPassword = asyncHandler(
  async (req, res) => {
    const {
      email,
      resetToken,
      newPassword,
    } = req.body

    if (!email?.trim()) {
      throw ApiError.badRequest(
        'Email is required'
      )
    }

    if (!resetToken) {
      throw ApiError.badRequest(
        'Reset token is required'
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

    const result =
      await authService.resetPassword({
        email,
        resetToken,
        newPassword,
      })

    res.json(result)
  }
)

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
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  me,
  logout,
  updateProfile,
  changePassword,
}