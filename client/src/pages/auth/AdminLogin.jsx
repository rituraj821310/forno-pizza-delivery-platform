import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  FiArrowRight,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi'

import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] =
    useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setSubmitting(true)

    try {
      const user = await login({
        email: email.trim(),
        password,
      })

      if (user?.role !== 'admin') {
        setError(
          'This account does not have admin access.'
        )

        return
      }

      navigate('/admin', {
        replace: true,
      })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Invalid email or password.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-flour">
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
            {/* Admin Header */}
            <div className="mb-7">
              <div
                className="
                  mb-5
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
                <FiShield size={23} />
              </div>

              <p className="label-sm text-tomato">
                Forno Admin Portal
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold">
                Admin Login
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-char/50">
                Sign in to manage orders, menu,
                users, and inventory.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <ErrorBanner message={error} />

              {/* Email */}
              <FormField
                label="Admin email"
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
                    placeholder="admin@example.com"
                  />
                </div>
              </FormField>

              {/* Password */}
              <FormField
                label="Password"
                htmlFor="password"
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
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="input-field !pl-11"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)

                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="Enter your password"
                  />
                </div>
              </FormField>

              {/* Login Button */}
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

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Admin

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

            {/* Customer Login */}
            <div
              className="
                mt-7
                border-t
                border-char/10
                pt-6
                text-center
              "
            >
              <Link
                to="/login"
                className="
                  text-sm
                  font-semibold
                  text-char/50
                  transition-colors
                  hover:text-tomato
                "
              >
                ← Back to customer login
              </Link>
            </div>

            <div
              className="
                mt-5
                text-center
                text-[11px]
                leading-relaxed
                text-char/35
              "
            >
              Authorized administrators only.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}