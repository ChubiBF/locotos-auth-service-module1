import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import type { IEmailCacheRepository } from '../../../domain/repositories/email-cache.repository.js'
import bcrypt from 'bcryptjs'

export class ResetPassword {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly emailCacheRepository: IEmailCacheRepository
  ) {}

  async execute (email: string, token: string, newPassword: string): Promise<void> {
    // 1. Recuperar el token de Redis
    const storedToken = await this.emailCacheRepository.getToken(`reset:${email}`)

    // 2. Validar (si Redis devolvió null, es que ya expiró solo)
    if (storedToken == null || storedToken !== token) {
      throw new Error('El enlace de recuperación es inválido o ha expirado')
    }

    // 3. Hashear la nueva contraseña (buena práctica que ya usas)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 4. Actualizar en MySQL
    const user = await this.userRepository.findByEmail(email)
    if (user != null) {
      // Necesitarás este método en tu userRepository
      await this.userRepository.updatePassword(user.id_usuario, hashedPassword)
    }

    // 5. IMPORTANTE: Borrar el token de Redis para que no se pueda reusar
    await this.emailCacheRepository.deleteToken(`reset:${email}`)
  }
}
