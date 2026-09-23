import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiArrowRight,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi'

import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import api from '../../services/api.js'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email) {
      setError(
        'Your password reset session has expired. Please start again.'
      )
      return
    }

    if (!otp.trim()) {
      setError('OTP is required')
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await api.post(
        '/auth/verify-reset-otp',
        {
          email,
          otp: otp.trim(),
        }
      )

      navigate('/reset-password', {
        state: {
          email,
          resetToken: response.data.resetToken,
        },
      })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Invalid or expired OTP. Please try again.'
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
              to="/forgot-password"
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
              Back
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
                <FiShield size={22} />
              </div>

              <p className="label-sm text-tomato">
                Verification
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold">
                Verify your OTP
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-char/50">
                We sent a 6-digit verification code to:
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-char">
                {email || 'your email address'}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <ErrorBanner message={error} />

              <FormField
                label="Verification code"
                htmlFor="otp"
              >
                <div className="relative">
                  <FiShield
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
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="
                      input-field
                      !pl-11
                      tracking-[0.35em]
                    "
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6)

                      setOtp(value)

                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="123456"
                  />
                </div>
              </FormField>

              <button
                type="submit"
                disabled={submitting}
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

                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP

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

            {/* Footer */}
            <div
              className="
                mt-6
                text-center
                text-[11px]
                leading-relaxed
                text-char/35
              "
            >
              Your OTP is valid for 5 minutes.
              <br />
              For security, you have a limited number of attempts.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}