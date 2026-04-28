import type { IperfilRepository } from '../../../domain/repositories/perfil.repository.js'
import type { Perfil } from '../../../domain/entities/Perfil.js'

export class EditProfile {
  constructor (private readonly perfilRepository: IperfilRepository) {}

  async execute (idPerfil: number, data: Partial<Perfil>): Promise<Perfil> {
    if (idPerfil <= 0) {
      throw new Error('El ID del perfil no es válido para la edición')
    }

    const existingPerfil = await this.perfilRepository.findById(idPerfil)
    if (existingPerfil == null) {
      throw new Error('NO SE ENCONTRO NINGUN PERFIL')
    }
    const updatedPerfil = await this.perfilRepository.update(idPerfil, data)

    if (updatedPerfil == null) {
      throw new Error('No se pudo actualizar el perfil: el perfil no existe o los datos son inválidos')
    }

    return updatedPerfil
  }
}
