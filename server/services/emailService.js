const sendPasswordResetOTP = async (email, otp) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      from: 'Forno Pizza <onboarding@resend.dev>',
      to: [email],
      subject: 'Forno Password Reset OTP',

      text: `Your Forno password reset OTP is ${otp}. This OTP will expire in 5 minutes. If you did not request a password reset, you can ignore this email.`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #d35400;">
            Forno Pizza
          </h2>

          <p>
            You requested to reset your Forno account password.
          </p>

          <p>
            Your verification code is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            If you didn't request a password reset, you can safely ignore
            this email.
          </p>

          <hr />

          <p style="font-size: 12px; color: #777;">
            This is an automated email from Forno Pizza.
          </p>

        </div>
      `,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('[email] Resend error:', errorData)
    throw new Error('Failed to send password reset email')
  }

  const data = await response.json()

  console.log('[email] Password reset OTP sent:', data.id)

  return data
}

export {
  sendPasswordResetOTP,
}