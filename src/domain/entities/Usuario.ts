import type { UsuarioBasic } from '../../application/dtos/usuario.dto.js'

export enum tipoUsuario {
  cliente = 'CLIENTE',
  admin = 'ADMIN'
}

export enum estadoUsuario {
  activo = 'ACTIVO',
  suspendido = 'SUSPENDIDO',
  pendiente_verificacion = 'PENDIENTE_VERIFICACION'
}

export interface Usuario extends UsuarioBasic {
  password_hash: string
}
