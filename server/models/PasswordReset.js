import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    used: {
      type: Boolean,
      default: false,
    },

    resetTokenHash: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Automatically delete expired password-reset records.
passwordResetSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

const PasswordReset = mongoose.model(
  'PasswordReset',
  passwordResetSchema
)

export default PasswordReset