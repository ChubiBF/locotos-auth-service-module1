import type { Usuario } from '../entities/Usuario.js'
import type { UsuarioToRegister } from '../../application/dtos/usuarioRegister.dto.js'

export interface IUserRepository {
  save: (user: UsuarioToRegister) => Promise<Usuario | null>
  findByEmail: (email: string) => Promise<Usuario | null>
  findById: (id: number) => Promise<Usuario | null>
  updatePassword: (id: number, hashedPassword: string) => Promise<void>
  verifyAccount: (id: number) => Promise <void>
}
