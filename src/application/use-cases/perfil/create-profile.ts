import type { Perfil, PerfilToRegister } from '../../../domain/entities/Perfil.js'
import type { IperfilRepository } from '../../../domain/repositories/perfil.repository.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'

export class CreateProfile {
  constructor (private readonly perfilRepository: IperfilRepository, private readonly userRepository: IUserRepository) {}

  async execute (perfil: PerfilToRegister): Promise<Perfil | null > {
    const user = await this.userRepository.findById(perfil.id_usuario)
    if (user == null) throw new Error('el usuario no existe')

    const newPerfil = await this.perfilRepository.save(perfil)
    if (newPerfil == null) throw new Error('no se pudo crear el perfil')

    return newPerfil
  }
}
