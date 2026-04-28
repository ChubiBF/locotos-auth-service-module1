import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import type { IEmailCacheRepository } from '../../../domain/repositories/email-cache.repository.js'

export class VerifyEmail {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly emailCacheRepository: IEmailCacheRepository
  ) {}

  async execute (email: string, code: string): Promise<void> {
    const storedCode = await this.emailCacheRepository.getToken(`verify:${email}`)

    if (storedCode == null || storedCode !== code) {
      throw new Error('Código de verificación incorrecto o expirado')
    }

    const user = await this.userRepository.findByEmail(email)
    if (user != null) {
      await this.userRepository.verifyAccount(user.id_usuario)
    }

    await this.emailCacheRepository.deleteToken(`verify:${email}`)
  }
}
