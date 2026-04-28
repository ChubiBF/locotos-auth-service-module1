import type { RowDataPacket } from 'mysql2/promise'
import type { Usuario } from '../../domain/entities/Usuario.js'
import type { UsuarioBasic } from '../dtos/usuario.dto.js'

export function mapUsuarioToUsuarioBasic (user: Usuario): UsuarioBasic {
  return {
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    correo: user.correo,
    tipo_usuario: user.tipo_usuario,
    estado: user.estado,
    fecha_registro: user.fecha_registro
  }
}

export function mapRowToUsuario (row: RowDataPacket): Usuario {
  return {
    id_usuario: row.id_usuario,
    nombre: row.nombre,
    correo: row.correo,
    password_hash: row.password_hash,
    tipo_usuario: row.tipo_usuario,
    estado: row.estado,
    fecha_registro: row.fecha_registro
  }
}
