import type { Request, Response } from 'express'
import { RequestPasswordReset } from '../../../application/use-cases/email/request-password-reset.js'
import { ResetPassword } from '../../../application/use-cases/email/reset-password.js'
import { VerifyEmail } from '../../../application/use-cases/email/verify-email.js'
import type { SendVerificationEmail } from '../../../application/use-cases/email/send-verify-email.js'

export class EmailController {
  constructor (
    private readonly requestReset: RequestPasswordReset,
    private readonly resetPass: ResetPassword,
    private readonly verify: VerifyEmail,
    private readonly sendVerificationEmail: SendVerificationEmail
  ) {}

  async requestPasswordReset (req: Request, res: Response): Promise<void> {
    try {
      const { correo } = req.body
      await this.requestReset.execute(correo)
      res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación' })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async resetPassword (req: Request, res: Response): Promise<void> {
    try {
      const { correo, token, newPassword } = req.body
      await this.resetPass.execute(correo, token, newPassword)
      res.status(200).json({ message: 'Contraseña actualizada correctamente' })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async verifyEmail (req: Request, res: Response): Promise<void> {
    try {
      const { correo, code } = req.body
      await this.verify.execute(correo, code)
      res.status(200).json({ message: 'Correo verificado con éxito' })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async resendVerification (req: Request, res: Response): Promise<void> {
    try {
      const { correo } = req.body

      await this.sendVerificationEmail.execute(correo)
      res.status(200).json({ message: 'Se ha enviado un nuevo código de verificación' })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }
}
