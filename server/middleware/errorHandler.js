import { nodeEnv } from '../config/env.js'

// Centralized error formatter.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Something went wrong'
  let details = err.details

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'

    details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([field, e]) => [
        field,
        e.message,
      ])
    )
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid value for "${err.path}"`
  }

  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `That ${field} is already in use`
  }

  if (statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    message,
    ...(details ? { details } : {}),
    ...(nodeEnv === 'development' && statusCode === 500
      ? { stack: err.stack }
      : {}),
  })
}

export default errorHandler