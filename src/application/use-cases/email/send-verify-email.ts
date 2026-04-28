import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import type { IEmailCacheRepository } from '../../../domain/repositories/email-cache.repository.js'
import { EmailService } from '../../../infrastructure/email/email.service.js'
import crypto from 'node:crypto'
import { estadoUsuario } from '../../../domain/entities/Usuario.js'

export class SendVerificationEmail {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly emailCacheRepository: IEmailCacheRepository,
    private readonly emailService: EmailService
  ) {}

  async execute (email: string): Promise<void> {
    try {
      const user = await this.userRepository.findByEmail(email)
      console.log(email)
      if (user == null) {
        throw new Error('No se encontró una cuenta con ese correo electrónico')
      }

      if (user.estado === estadoUsuario.activo) {
        throw new Error('Esta cuenta ya ha sido verificada')
      }

      const code = crypto.randomInt(100000, 999999).toString()

      await this.emailCacheRepository.saveToken(`verify:${email}`, code, 900)

      await this.emailService.sendVerificationEmail(email, user.nombre, code)
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
