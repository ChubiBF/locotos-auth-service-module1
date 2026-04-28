import type { Usuario } from '../../domain/entities/Usuario.js'

export interface UsuarioToRegister extends Omit<Usuario, 'id_usuario' | 'fecha_registro'> {}

export interface UsuarioToRegisterFromRequest extends Omit<Usuario, 'id_usuario' | 'fecha_registro' | 'password_hash'> {
  password: string
}
