import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi'

import { useAuth } from '../../hooks/useAuth.js'
import { validateLoginForm } from '../../utils/validators.js'

import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'

export default function Login() {
  const { login } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo =
    location.state?.from?.pathname || '/'

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    // Clear field error while typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: '',
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors =
      validateLoginForm(form)

    setErrors(validationErrors)

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return
    }

    setSubmitting(true)
    setServerError('')

    try {
      // login() returns the logged-in user
      const loggedInUser = await login(form)

      // Redirect admin users to admin dashboard
      const destination =
        loggedInUser?.role === 'admin'
          ? '/admin'
          : redirectTo

      navigate(destination, {
        replace: true,
      })
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Could not log in. Check your details and try again.'
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

      <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-20">

        {/* Left side */}
        <div className="hidden lg:block">
          <div className="max-w-lg">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-tomato/15
                bg-tomato/5
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-tomato
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-tomato" />

              Welcome back
            </span>

            <h1
              className="
                mt-6
                font-display
                text-5xl
                font-semibold
                leading-[1.05]
                text-char
                xl:text-6xl
              "
            >
              Good pizza is

              <span className="block text-tomato">
                worth coming back for.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-md
                text-base
                leading-relaxed
                text-char/55
              "
            >
              Sign in to track your orders, save
              your favorites, and get your next
              pizza started in just a few clicks.
            </p>

            <div className="mt-8 flex items-center gap-3">

              <div className="flex -space-x-2">
                {['M', 'A', 'R'].map((letter) => (
                  <div
                    key={letter}
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-flour
                      bg-crust-light
                      font-display
                      text-sm
                      font-semibold
                      text-char
                    "
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <p className="text-xs text-char/50">
                Your favorite pizza place, ready when you are.
              </p>

            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="mx-auto w-full max-w-md">

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

            {/* Mobile heading */}
            <div className="mb-7 lg:hidden">

              <p className="label-sm text-tomato">
                Welcome back
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold">
                Log in to Forno
              </h1>

            </div>

            {/* Desktop heading */}
            <div className="mb-7 hidden lg:block">

              <h2 className="font-display text-3xl font-semibold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-char/50">
                Log in to continue your order.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >

              <ErrorBanner message={serverError} />

              {/* Email */}
              <FormField
                label="Email"
                htmlFor="email"
                error={errors.email}
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
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />

                </div>
              </FormField>

              {/* Password */}
              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password}
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
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="current-password"
                    className="input-field !pl-11 !pr-11"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      text-char/40
                      transition-colors
                      hover:bg-char/5
                      hover:text-char
                    "
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>

                </div>
              </FormField>

              {/* Forgot password */}
              <div className="-mt-2 flex justify-end">

                <Link
                  to="/forgot-password"
                  className="
                    text-xs
                    font-semibold
                    text-tomato
                    transition-colors
                    hover:text-tomato-dark
                  "
                >
                  Forgot password?
                </Link>

              </div>

              {/* Submit */}
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

                    Logging in...
                  </>
                ) : (
                  <>
                    Log in

                    <FiArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-char/10" />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-char/30
                "
              >
                Forno account
              </span>

              <div className="h-px flex-1 bg-char/10" />

            </div>

            {/* Register */}
            <p className="text-center text-sm text-char/55">

              New to Forno?{' '}

              <Link
                to="/register"
                className="
                  font-semibold
                  text-tomato
                  transition-colors
                  hover:text-tomato-dark
                "
              >
                Create an account
              </Link>

            </p>

            {/* Security note */}
            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
                text-[11px]
                text-char/35
              "
            >
              <FiShield size={13} />

              Your account is protected with secure authentication.
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}