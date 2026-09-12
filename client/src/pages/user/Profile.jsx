import { useState } from 'react'
import {
  FiCheckCircle,
  FiHome,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
} from 'react-icons/fi'

import { useAuth } from '../../hooks/useAuth.js'
import FormField from '../../components/FormField.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import api from '../../services/api.js'

export default function Profile() {
  const { user, updateProfile } = useAuth()

  // ---------------------------------------
  // Profile state
  // ---------------------------------------

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
  })

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // ---------------------------------------
  // Password state
  // ---------------------------------------

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [changingPassword, setChangingPassword] =
    useState(false)

  const [passwordSuccess, setPasswordSuccess] =
    useState(false)

  const [passwordError, setPasswordError] =
    useState('')

  // ---------------------------------------
  // Profile handlers
  // ---------------------------------------

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setSuccess(false)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (
      form.phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        form.phone
      )
    ) {
      setError('Please enter a valid phone number.')
      return
    }

    if (!form.street.trim()) {
      setError('Please enter your street address.')
      return
    }

    if (!form.city.trim()) {
      setError('Please enter your city.')
      return
    }

    if (!form.zip.trim()) {
      setError('Please enter your ZIP code.')
      return
    }

    setSaving(true)
    setSuccess(false)
    setError('')

    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
        },
      })

      setSuccess(true)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not save your profile changes.'
      )
    } finally {
      setSaving(false)
    }
  }

  // ---------------------------------------
  // Password handlers
  // ---------------------------------------

  function handlePasswordChange(e) {
    const {
      name,
      value,
    } = e.target

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setPasswordSuccess(false)
    setPasswordError('')
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm

    setPasswordSuccess(false)
    setPasswordError('')

    if (!currentPassword) {
      setPasswordError(
        'Please enter your current password.'
      )
      return
    }

    if (!newPassword) {
      setPasswordError(
        'Please enter a new password.'
      )
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(
        'New password must be at least 6 characters.'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New passwords do not match.'
      )
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        'New password must be different from your current password.'
      )
      return
    }

    setChangingPassword(true)

    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword,
      })

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setPasswordSuccess(true)
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message ||
          'Could not change your password.'
      )
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-flour px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <p className="label-sm text-tomato">
            Account
          </p>

          <h1 className="mt-1 font-display text-3xl font-semibold text-char sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-char/50">
            Manage your personal information, delivery
            details, and account security.
          </p>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-[2rem] border border-char/10 bg-white shadow-sm">

          {/* ---------------------------------------
              Account information
          --------------------------------------- */}

          <div className="border-b border-char/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tomato/10 text-tomato">
                <FiUser size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-char/35">
                  Account
                </p>

                <h2 className="font-display text-xl font-semibold">
                  Personal information
                </h2>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-char/8 bg-flour/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-char/5 text-char/50">
                  <FiMail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-char/35">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-medium text-char">
                    {user?.email || 'No email available'}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-char/40">
                Your email address cannot be changed here.
              </p>
            </div>
          </div>

          {/* ---------------------------------------
              Profile form
          --------------------------------------- */}

          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">

              {/* Feedback */}
              <div className="mb-6 space-y-3">
                <ErrorBanner message={error} />

                {success && (
                  <div className="flex items-center gap-2 rounded-2xl border border-basil/20 bg-basil/10 px-4 py-3 text-sm font-medium text-basil-dark">
                    <FiCheckCircle size={17} />
                    Profile updated successfully.
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tomato/10 text-tomato">
                    <FiPhone size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                      Contact
                    </p>

                    <h2 className="font-display font-semibold">
                      Contact details
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormField
                    label="Full name"
                    htmlFor="name"
                  >
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="input-field"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      disabled={saving}
                    />
                  </FormField>

                  <FormField
                    label="Phone"
                    htmlFor="phone"
                  >
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="input-field"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      disabled={saving}
                    />
                  </FormField>

                </div>
              </div>

              {/* Address */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil/10 text-basil-dark">
                    <FiMapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                      Delivery
                    </p>

                    <h2 className="font-display font-semibold">
                      Default delivery address
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">

                  <FormField
                    label="Street address"
                    htmlFor="street"
                  >
                    <div className="relative">
                      <FiHome
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-char/30"
                        size={17}
                      />

                      <input
                        id="street"
                        name="street"
                        type="text"
                        autoComplete="street-address"
                        className="input-field pl-11"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="House number, street, area"
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <FormField
                      label="City"
                      htmlFor="city"
                    >
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        className="input-field"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        disabled={saving}
                      />
                    </FormField>

                    <FormField
                      label="ZIP code"
                      htmlFor="zip"
                    >
                      <input
                        id="zip"
                        name="zip"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        className="input-field"
                        value={form.zip}
                        onChange={handleChange}
                        placeholder="ZIP code"
                        disabled={saving}
                      />
                    </FormField>

                  </div>
                </div>
              </div>
            </div>

            {/* Profile footer */}
            <div className="flex flex-col gap-4 border-t border-char/10 bg-flour/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

              <div className="text-xs text-char/40">
                <p className="font-medium text-char/50">
                  Your information is private
                </p>

                <p className="mt-0.5">
                  These details are used for your orders and delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-tomato
                  px-6
                  py-3
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
                <FiSave size={17} />

                {saving
                  ? 'Saving...'
                  : 'Save changes'}
              </button>
            </div>
          </form>

          {/* ---------------------------------------
              Security / Change password
          --------------------------------------- */}

          <div className="border-t border-char/10 p-6 sm:p-8">

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-basil/10 text-basil-dark">
                <FiLock size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-char/35">
                  Security
                </p>

                <h2 className="font-display text-xl font-semibold">
                  Change password
                </h2>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-char/50">
              Choose a strong password that you don't use
              anywhere else.
            </p>

            {/* Password feedback */}
            <div className="mb-6 space-y-3">
              <ErrorBanner message={passwordError} />

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-2xl border border-basil/20 bg-basil/10 px-4 py-3 text-sm font-medium text-basil-dark">
                  <FiCheckCircle size={17} />
                  Password changed successfully.
                </div>
              )}
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4"
            >

              <FormField
                label="Current password"
                htmlFor="currentPassword"
              >
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  className="input-field"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  disabled={changingPassword}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">

                <FormField
                  label="New password"
                  htmlFor="newPassword"
                >
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    className="input-field"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 6 characters"
                    disabled={changingPassword}
                  />
                </FormField>

                <FormField
                  label="Confirm new password"
                  htmlFor="confirmPassword"
                >
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="input-field"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat your new password"
                    disabled={changingPassword}
                  />
                </FormField>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-char/10
                    bg-char
                    px-6
                    py-3
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-char/90
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <FiLock size={16} />

                  {changingPassword
                    ? 'Changing password...'
                    : 'Change password'}
                </button>
              </div>

            </form>
          </div>

          {/* Bottom accent */}
          <div className="h-1.5 bg-gradient-to-r from-tomato via-cheese to-basil" />

        </div>
      </div>
    </div>
  )
}