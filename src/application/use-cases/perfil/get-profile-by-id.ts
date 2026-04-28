import type { IperfilRepository } from '../../../domain/repositories/perfil.repository.js'
import type { Perfil } from '../../../domain/entities/Perfil.js'

export class GetProfileById {
  constructor (private readonly perfilRepository: IperfilRepository) {}

  async execute (idPerfil: number): Promise<Perfil> {
    // 1. Validaciones básicas de entrada
    if (idPerfil <= 0) {
      throw new Error('El ID del perfil no es válido para la edición')
    }

    const perfilFounded = await this.perfilRepository.findById(idPerfil)

    // 3. Manejo de errores basado en el resultado
    if (perfilFounded == null) {
      throw new Error('NO SE ENCONTRO NINGUN PERFIL')
    }

    return perfilFounded
  }
}
