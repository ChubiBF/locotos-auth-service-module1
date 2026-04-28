import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import type { IperfilRepository } from '../../domain/repositories/perfil.repository.js'
import type { Perfil, PerfilToRegister } from '../../domain/entities/Perfil.js'
import { mapPerfilResultToPerfil, mapRowToPerfilList } from '../../application/mappers/perfil.mappers.js'

export class MySQLPerfilRepository implements IperfilRepository {
  constructor (private readonly db: Pool) {}

  async save (perfil: Partial <PerfilToRegister>): Promise<Perfil | null> {
    try {
      const query = 'INSERT INTO Perfil (id_usuario, nombre, avatar_url, id_clasificacion_maxima, idioma_preferido, modo_oscuro) VALUES (?,?,?,?,?,?)'

      const values = [
        perfil.id_usuario ?? null,
        perfil.nombre ?? null,
        perfil.avatar_url ?? null,
        perfil.id_clasificacion_maxima ?? null,
        perfil.idioma_preferido ?? null,
        perfil.modo_oscuro ?? null
      ]

      const [result] = await this.db.execute<ResultSetHeader>(query, values)
      if (result.affectedRows === 0) return null
      const newPerfil = mapPerfilResultToPerfil({ id_perfil: result.insertId, ...perfil, fecha_creacion: new Date().toISOString() })
      return newPerfil
    } catch (e) {
      console.log({ e })
      return null
    }
  }

  async findByUsuarioId (usuarioId: number): Promise<Perfil[]> {
    if (usuarioId <= 0) return []
    try {
      const query = `SELECT id_perfil, id_usuario, nombre, avatar_url, id_clasificacion_maxima, idioma_preferido, modo_oscuro, fecha_creacion
     FROM Perfil WHERE id_usuario = ? `

      const [rows] = await this.db.execute<RowDataPacket[]>(query, [usuarioId])

      if (rows.length === 0 || rows[0] === undefined) return []

      const PerfilList = mapRowToPerfilList(rows)
      return PerfilList
    } catch (e: any) {
      console.log(e.message)
      return []
    }
  }

  async delete (id: number): Promise<boolean> {
    if (id <= 0) return false
    try {
      const query = 'DELETE FROM Perfil WHERE id_perfil = ?'
      const [result] = await this.db.execute<ResultSetHeader>(query, [id])

      if (result.affectedRows > 0) return true
    } catch {
      return false
    }
    return false
  }

  async findById (id: number): Promise<Perfil | null> {
    if (id <= 0) return null
    try {
      const query = 'SELECT id_perfil, id_usuario, nombre, avatar_url, id_clasificacion_maxima, idioma_preferido, modo_oscuro, fecha_creacion FROM Perfil WHERE id_perfil = ?'
      const [rows] = await this.db.execute<RowDataPacket[]>(query, [id])

      if (rows.length === 0 || rows[0] === undefined) return null

      return mapPerfilResultToPerfil(rows[0] as Partial<Perfil>)
    } catch (e) {
      console.log({ error_findById: e })
      return null
    }
  }

  async update (id: number, data: Partial<Perfil>): Promise<Perfil | null> {
    if (id <= 0) return null
    try {
      const entries = Object.entries(data).filter(([key, value]) =>
        value !== undefined &&
        ['nombre', 'avatar_url', 'id_clasificacion_maxima', 'idioma_preferido', 'modo_oscuro'].includes(key)
      )

      if (entries.length === 0) return await this.findById(id)

      const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
      const values = entries.map(([, value]) => value)

      const query = `UPDATE Perfil SET ${setClause} WHERE id_perfil = ?`
      const [result] = await this.db.execute<ResultSetHeader>(query, [...values, id])

      if (result.affectedRows === 0) return null

      return await this.findById(id)
    } catch (e) {
      console.log({ error_update: e })
      return null
    }
  }
}
