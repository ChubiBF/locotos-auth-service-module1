import type { IAuthSesionRepository } from '../../../domain/repositories/auth.sesion.repository.js'

export class ValidateSession {
  constructor (private readonly sessionRepository: IAuthSesionRepository) {}

  async execute (token: string): Promise<{ valid: boolean, id_usuario?: number, message?: string }> {
    if (token == null) {
      return { valid: false, message: 'Token no proporcionado' }
    }

    try {
      const idUsuario = await this.sessionRepository.getUserIdByToken(token)

      if (idUsuario > 0) {
        return { valid: true, id_usuario: idUsuario }
      }

      return { valid: false, message: 'Sesión expirada o inválida' }
    } catch (error) {
      throw new Error('Error al validar la sesión en el sistema')
    }
  }
}
