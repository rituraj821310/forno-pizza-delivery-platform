import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiMail,
  FiArrowLeft,
} from 'react-icons/fi'

import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import api from '../../services/api.js'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post('/auth/forgot-password', {
        email: email.trim(),
      })

      navigate('/verify-otp', {
        state: {
          email: email.trim(),
        },
      })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not send the OTP. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-flour">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-tomato/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cheese/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center px-5 py-12 sm:px-8">

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

            {/* Back to login */}
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
            <div className="mt-8 mb-7">

              <p className="label-sm text-tomato">
                Account recovery
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold">
                Forgot your password?
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-char/50">
                Enter the email address associated with
                your Forno account and we'll send you a
                verification code.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >

              <ErrorBanner message={error} />

              <FormField
                label="Email"
                htmlFor="email"
              >
                <div className="relative">

                  <FiMail
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
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input-field !pl-11"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)

                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="you@example.com"
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

                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP

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

            {/* Security note */}
            <div
              className="
                mt-6
                text-center
                text-[11px]
                text-char/35
              "
            >
              We'll send a one-time verification code
              to your email.
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}