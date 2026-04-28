import type { IperfilRepository } from '../../../domain/repositories/perfil.repository.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import type { Perfil } from '../../../domain/entities/Perfil.js'

export class GetProfilesByUser {
  constructor (
    private readonly perfilRepository: IperfilRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute (usuarioId: number): Promise<Perfil[]> {
    const user = await this.userRepository.findById(usuarioId)
    if (user == null) {
      throw new Error('No se pueden obtener perfiles de un usuario inexistente')
    }

    return await this.perfilRepository.findByUsuarioId(usuarioId)
  }
}
