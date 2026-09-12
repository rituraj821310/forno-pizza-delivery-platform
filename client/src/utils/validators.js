export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}

export function isValidPhone(phone) {
  return /^\+?[0-9]{7,15}$/.test(String(phone).replace(/[\s-]/g, ''))
}

export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateRegisterForm({ name, email, password, phone }) {
  const errors = {}
  if (!isNotEmpty(name)) errors.name = 'Name is required'
  if (!isValidEmail(email)) errors.email = 'Enter a valid email'
  if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters'
  if (phone && !isValidPhone(phone)) errors.phone = 'Enter a valid phone number'
  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}
  if (!isValidEmail(email)) errors.email = 'Enter a valid email'
  if (!isNotEmpty(password)) errors.password = 'Password is required'
  return errors
}
