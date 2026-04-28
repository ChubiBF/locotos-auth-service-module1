import type { IUserRepository } from '../../domain/repositories/user.repository.js'
import type { Usuario } from '../../domain/entities/Usuario.js'
import type { UsuarioToRegister } from '../../application/dtos/usuarioRegister.dto.js'
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { mapRowToUsuario } from '../../application/mappers/usuario.mappers.js'

export class MySQLUserRepository implements IUserRepository {
  constructor (private readonly db: Pool) {}

  async save (user: UsuarioToRegister): Promise<Usuario | null> {
    try {
      const query = 'INSERT INTO Usuario (nombre, correo, password_hash, tipo_usuario) VALUES (?, ?, ?, ?)'

      const [result] = await this.db.execute(query, [user.nombre, user.correo, user.password_hash, user.tipo_usuario])

      const insertResult = result as any
      if (insertResult.affectedRows === 0) return null

      return {
        ...user,
        id_usuario: insertResult.insertId,
        fecha_registro: Date.now().toString()
      }
    } catch (e) {
      console.log({ e })
      return null
    }
  }

  async findByEmail (email: string): Promise<Usuario | null> {
    try {
      const query = 'SELECT id_usuario, nombre, correo, password_hash, tipo_usuario, estado, fecha_registro FROM Usuario WHERE correo = ?'

      const [rows] = await this.db.execute<RowDataPacket[]>(query, [email])

      if (rows.length === 0 || rows[0] === undefined) return null
      return mapRowToUsuario(rows[0])
    } catch {
      return null
    }
  }

  async findById (id: number): Promise<Usuario | null> {
    try {
      const query = 'SELECT id_usuario, nombre, correo, password_hash, tipo_usuario, estado, fecha_registro FROM Usuario WHERE id_usuario = ?'

      const [rows] = await this.db.execute<RowDataPacket[]>(query, [id])

      if (rows.length === 0 || rows[0] === undefined) return null
      return mapRowToUsuario(rows[0])
    } catch {
      return null
    }
  }

  async updatePassword (idUsuario: number, passwordHash: string): Promise<void> {
    const query = 'UPDATE Usuario SET password_hash = ? WHERE id_usuario = ?'
    await this.db.execute(query, [passwordHash, idUsuario])
  }

  async verifyAccount (idUsuario: number): Promise<void> {
    const query = 'UPDATE Usuario SET estado = "activo" WHERE id_usuario = ?'
    await this.db.execute(query, [idUsuario])
  }
}
