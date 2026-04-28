import type { IperfilRepository } from '../../../domain/repositories/perfil.repository.js'

export class DeleteProfile {
  constructor (private readonly perfilRepository: IperfilRepository) {}

  async execute (idPerfil: number): Promise<void> {
    if (idPerfil <= 0) {
      throw new Error('ID de perfil inválido')
    }

    const success = await this.perfilRepository.delete(idPerfil)

    if (!success) {
      throw new Error('No se pudo eliminar el perfil o el perfil no existe')
    }
  }
}
