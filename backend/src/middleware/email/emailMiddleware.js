import CONFIG from '../../config'
import nodemailer from 'nodemailer'
import { resetPasswordMail, wrongAccountMail } from './templates/passwordReset'
import { signupTemplate } from './templates/signup'

const transporter = () => {
  const configs = {
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    ignoreTLS: CONFIG.SMTP_IGNORE_TLS,
    secure: false, // true for 465, false for other ports
  }
  const { SMTP_USERNAME: user, SMTP_PASSWORD: pass } = CONFIG
  if (user && pass) {
    configs.auth = { user, pass }
  }
  return nodemailer.createTransport(configs)
}

const awaitAndReturnTrue = async (resolve, root, args, context, resolveInfo) => {
  await resolve(root, args, context, resolveInfo)
  return true
}

const sendSignupMail = async (resolve, root, args, context, resolveInfo) => {
  const { email } = args
  const resolved = await resolve(root, args, context, resolveInfo)
  const { response, nonce } = resolved
  delete resolved.nonce
  await transporter().sendMail(signupTemplate({ email, nonce }))
  return response
}

export default function(isEnabled) {
  if (!isEnabled)
    return {
      Mutation: {
        requestPasswordReset: awaitAndReturnTrue,
        CreateSignUp: awaitAndReturnTrue,
        CreateSignUpByInvitationCode: awaitAndReturnTrue,
      },
    }

  return {
    Mutation: {
      requestPasswordReset: async (resolve, root, args, context, resolveInfo) => {
        const { email } = args
        const resolved = await resolve(root, args, context, resolveInfo)
        const { user, code, name } = resolved
        const mailTemplate = user ? resetPasswordMail : wrongAccountMail
        await transporter().sendMail(mailTemplate({ email, code, name }))
        return true
      },
      CreateSignUp: sendSignupMail,
      CreateSignUpByInvitationCode: sendSignupMail,
    },
  }
}
