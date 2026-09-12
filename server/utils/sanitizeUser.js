// Strips fields that should never reach the client (password hash, __v, etc.)

function sanitizeUser(userDoc) {
  const user = userDoc.toObject
    ? userDoc.toObject()
    : { ...userDoc }

  delete user.password
  delete user.__v

  return user
}

export default sanitizeUser