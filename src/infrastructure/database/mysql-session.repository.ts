import type { Pool, ResultSetHeader } from 'mysql2/promise'
import type { ISessionRepository } from '../../domain/repositories/sesion.repository.js'
import type { SesionUsuario } from '../../domain/entities/SesionUsuario.js'

export class MySQLSessionRepository implements ISessionRepository {
  constructor (private readonly db: Pool) { }

  async save (sesionUsuario: SesionUsuario): Promise<void> {
    const query = 'INSERT INTO Sesion_Usuario (id_usuario, token_mfa, ip_origen, dispositivo) VALUES (?,?,?,?)'
    const params = [sesionUsuario.id_usuario, sesionUsuario.token_mfa, sesionUsuario.ip_origen, sesionUsuario.dispositivo].map(p => p ?? null)
    console.log(params)

    const [result] = await this.db.execute<ResultSetHeader>(query, params)

    if (result.affectedRows === 0) throw new Error('no se pudo crear la sesion')
  }

  async findAllByUserId (idUsuario: number): Promise<SesionUsuario[]> {
    const [rows] = await this.db.execute('SELECT * FROM Sesion_Usuario WHERE id_usuario = ?', [idUsuario])
    return rows as SesionUsuario[]
  }

  async deleteOldSessions (idUsuario: number): Promise<void> {
    const [result] = await this.db.execute<ResultSetHeader>('DELETE FROM Sesion_Usuario WHERE id_usuario = ?', [idUsuario])

    if (result.affectedRows === 0) throw new Error('no se encontro ni elimino ninguna sesion')
  }
}
