import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import type { IEmailCacheRepository } from '../../../domain/repositories/email-cache.repository.js'
import { EmailService } from '../../../infrastructure/email/email.service.js'
import crypto from 'node:crypto'

export class RequestPasswordReset {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly emailCacheRepository: IEmailCacheRepository,
    private readonly emailService: EmailService
  ) {}

  async execute (email: string): Promise<void> {
    // 1. Validar que el usuario existe
    const user = await this.userRepository.findByEmail(email)
    if (user == null) {
      // Por seguridad, a veces es mejor no decir que el correo no existe,
      // pero para tu lab podemos lanzar el error.
      throw new Error('No existe una cuenta asociada a este correo electrónico')
    }

    // 2. Generar un token seguro (UUID)
    const token = crypto.randomUUID()

    // 3. Guardar en Redis usando el prefijo que definimos (Expira en 1 hora = 3600s)
    await this.emailCacheRepository.saveToken(`reset:${email}`, token, 3600)

    // 4. Enviar el correo con el enlace (ajusta la URL según tu frontend)
    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`
    await this.emailService.sendPasswordResetEmail(email, user.nombre, resetLink)
  }
}
