import type { IAuthSesionRepository } from '../../../domain/repositories/auth.sesion.repository.js'

export class LogoutUser {
  constructor (private readonly sessionRepository: IAuthSesionRepository) {}

  async execute (token: string): Promise<boolean> {
    if (token == null) return false

    await this.sessionRepository.closeSesion(token)
    return true
  }
}
