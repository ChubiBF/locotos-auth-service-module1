import bcrypt from 'bcryptjs'

import type { UsuarioToRegister } from '../../dtos/usuarioRegister.dto.js'
import type { UsuarioBasic } from '../../dtos/usuario.dto.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import { mapUsuarioToUsuarioBasic } from '../../mappers/usuario.mappers.js'

export class RegisterUser {
  constructor (private readonly userRepository: IUserRepository) {}

  async execute (data: UsuarioToRegister): Promise<UsuarioBasic | null> {
    const existing = await this.userRepository.findByEmail(data.correo)
    if (existing != null) throw new Error('el correo ya esta registrado')

    // bcrypt
    const password = await bcrypt.hash(data.password_hash, 10)

    const usuario = await this.userRepository.save({ ...data, password_hash: password })

    if (usuario == null) return null
    return mapUsuarioToUsuarioBasic(usuario)
  }
}
