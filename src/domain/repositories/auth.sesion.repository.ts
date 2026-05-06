import type { AuthSesion } from '../entities/AuthSesion.js'
import type { id_usuario } from '../entities/SesionUsuario.js'

export interface IAuthSesionRepository {
  saveSesion: (sesion: AuthSesion) => Promise<void>
  getUserIdByToken: (token: string) => Promise<number>
  closeSesion: (token: string) => Promise<void>
  closeAllSesions: (idUsuario: id_usuario) => Promise<void>
}
