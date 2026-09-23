import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiArrowRight,
  FiArrowLeft,
  FiLock,
  FiCheckCircle,
} from 'react-icons/fi'

import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import api from '../../services/api.js'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ''
  const resetToken = location.state?.resetToken || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] =
    useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !resetToken) {
      setError(
        'Your password reset session has expired. Please start again.'
      )
      return
    }

    if (!newPassword) {
      setError('New password is required')
      return
    }

    if (newPassword.length < 6) {
      setError(
        'Password must be at least 6 characters'
      )
      return
    }

    if (!confirmPassword) {
      setError(
        'Please confirm your new password'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword,
      })

      setSuccess(
        'Password reset successfully. Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not reset your password. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-flour">
      {/* Decorative background */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-tomato/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-cheese/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-64px)]
          max-w-md
          items-center
          px-5
          py-12
          sm:px-8
        "
      >
        <div className="w-full">
          <div
            className="
              rounded-[2rem]
              border
              border-char/10
              bg-white
              p-6
              shadow-xl
              shadow-char/5
              sm:p-8
            "
          >
            {/* Back */}
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-char/50
                transition-colors
                hover:text-tomato
              "
            >
              <FiArrowLeft size={15} />
              Back to login
            </Link>

            {/* Heading */}
            <div className="mb-7 mt-8">
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-tomato/10
                  text-tomato
                "
              >
                <FiLock size={22} />
              </div>

              <p className="label-sm text-tomato">
                New password
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold">
                Reset your password
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-char/50">
                Create a new password for your Forno
                account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <ErrorBanner message={error} />

              {success && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-green-700
                  "
                >
                  <FiCheckCircle
                    size={18}
                    className="shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}

              <FormField
                label="New password"
                htmlFor="newPassword"
              >
                <div className="relative">
                  <FiLock
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-char/35
                    "
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    className="input-field !pl-11"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(
                        e.target.value
                      )

                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="Enter new password"
                  />
                </div>
              </FormField>

              <FormField
                label="Confirm password"
                htmlFor="confirmPassword"
              >
                <div className="relative">
                  <FiLock
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-char/35
                    "
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="input-field !pl-11"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(
                        e.target.value
                      )

                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="Confirm new password"
                  />
                </div>
              </FormField>

              <p className="text-xs text-char/40">
                Password must contain at least 6
                characters.
              </p>

              <button
                type="submit"
                disabled={submitting || !!success}
                className="
                  group
                  mt-1
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-tomato
                  px-6
                  py-3.5
                  font-semibold
                  text-flour
                  shadow-lg
                  shadow-tomato/20
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-tomato-dark
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {submitting ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-flour/30
                        border-t-flour
                      "
                    />

                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password

                    <FiArrowRight
                      size={17}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>

            <div
              className="
                mt-6
                text-center
                text-[11px]
                leading-relaxed
                text-char/35
              "
            >
              After resetting your password,
              you'll need to log in again.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}