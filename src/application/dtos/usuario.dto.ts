import { tipoUsuario, estadoUsuario } from '../../domain/entities/Usuario.js'

export type IdUsuario = number

export interface UsuarioBasic {
  id_usuario: IdUsuario
  nombre: string
  correo: string
  tipo_usuario: tipoUsuario
  estado: estadoUsuario
  fecha_registro: string
}
