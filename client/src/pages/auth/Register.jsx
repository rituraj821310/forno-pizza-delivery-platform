import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth.js'
import { validateRegisterForm } from '../../utils/validators.js'
import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validateRegisterForm(form)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    setServerError('')

    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Could not create your account. Try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-flour">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-tomato/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cheese/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20">
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
                border-basil/20
                bg-basil/5
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-basil-dark
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-basil" />
              Join Forno
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
              Your next
              <span className="block text-tomato">
                great pizza awaits.
              </span>
            </h1>

            <p className="
              mt-6
              max-w-md
              text-base
              leading-relaxed
              text-char/55
            ">
              Create your Forno account and make ordering your
              favorite pizza faster, easier, and more personal.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit
                icon={<FiUser size={17} />}
                title="Your account"
                text="Keep your details ready for every order."
              />

              <Benefit
                icon={<FiTruckIcon size={17} />}
                title="Easy delivery"
                text="Get your pizza delivered without the hassle."
              />

              <Benefit
                icon={<FiArrowRight size={17} />}
                title="Order tracking"
                text="Follow your pizza from kitchen to doorstep."
              />
            </div>
          </div>
        </div>

        {/* Registration card */}
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
            {/* Heading */}
            <div className="mb-7">
              <p className="label-sm text-tomato">
                Create account
              </p>

              <h1 className="
                mt-1
                font-display
                text-3xl
                font-semibold
                text-char
              ">
                Join Forno
              </h1>

              <p className="mt-2 text-sm text-char/50">
                Save your details and make your next order quicker.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <ErrorBanner message={serverError} />

              {/* Name */}
              <FormField
                label="Full name"
                htmlFor="name"
                error={errors.name}
              >
                <div className="relative">
                  <FiUser
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
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="input-field !pl-11"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
              </FormField>

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

              {/* Phone */}
              <FormField
                label="Phone (optional)"
                htmlFor="phone"
                error={errors.phone}
              >
                <div className="relative">
                  <FiPhone
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
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="input-field !pl-11"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
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
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input-field !pl-11 !pr-11"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="
                  group
                  mt-2
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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

              <span className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-char/30
              ">
                Already a member?
              </span>

              <div className="h-px flex-1 bg-char/10" />
            </div>

            {/* Login */}
            <p className="text-center text-sm text-char/55">
              Already have an account?{' '}
              <Link
                to="/login"
                className="
                  font-semibold
                  text-tomato
                  transition-colors
                  hover:text-tomato-dark
                "
              >
                Log in
              </Link>
            </p>

            {/* Security */}
            <div className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              text-[11px]
              text-char/35
            ">
              <FiShield size={13} />
              Your information is protected securely.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Benefit({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-white
        text-tomato
        shadow-sm
        ring-1
        ring-char/5
      ">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-char">
          {title}
        </p>

        <p className="text-xs text-char/45">
          {text}
        </p>
      </div>
    </div>
  )
}

function FiTruckIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 5h11v11H3z" />
      <path d="M14 9h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  )
}