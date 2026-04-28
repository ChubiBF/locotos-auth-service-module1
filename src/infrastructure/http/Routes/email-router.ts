import { Router } from 'express'
import { emailController } from '../../container.js'
import { validateUser } from '../helpers/user-helper.js'
import { forgotPasswordSchema, sendVerificationSchema, resetPasswordSchema, verifyEmailSchema } from '../schemas/email-send-schema.js'

const emailRouter: Router = Router()

emailRouter.post('/forgot-password',
  validateUser(forgotPasswordSchema),
  async (req, res) => await emailController.requestPasswordReset(req, res)
)

emailRouter.post('/reset-password',
  validateUser(resetPasswordSchema),
  async (req, res) => await emailController.resetPassword(req, res)
)

emailRouter.post('/verify-email',
  validateUser(verifyEmailSchema),
  async (req, res) => await emailController.verifyEmail(req, res)
)

emailRouter.post('/send-verification',
  validateUser(sendVerificationSchema),
  async (req, res) => await emailController.resendVerification(req, res)
)

export default emailRouter
