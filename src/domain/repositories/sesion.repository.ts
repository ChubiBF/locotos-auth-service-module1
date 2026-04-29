import type { id_usuario, SesionUsuario } from '../entities/SesionUsuario.js'

export interface ISessionRepository {
  save: (sesionUsuario: SesionUsuario) => Promise<void>
  findAllByUserId: (idUsuario: id_usuario) => Promise<SesionUsuario[]>
  deleteOldSessions: (idUsuario: id_usuario) => Promise<void>
}
