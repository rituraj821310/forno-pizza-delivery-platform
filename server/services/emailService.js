import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

const sendPasswordResetOTP = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from: `"Forno Pizza" <${process.env.EMAIL_USER}>`,
    to: email,
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
  })
}

export {
  sendPasswordResetOTP,
}