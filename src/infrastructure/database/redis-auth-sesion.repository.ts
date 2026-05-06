import { redisClient } from './redis-config.js'
import type { IAuthSesionRepository } from '../../domain/repositories/auth.sesion.repository.js'
import type { AuthSesion } from '../../domain/entities/AuthSesion.js'
import type { id_usuario } from '../../domain/entities/SesionUsuario.js'

export class RedisAuthSesionRepository implements IAuthSesionRepository {
  private readonly client = redisClient
  private readonly SESSION_PREFIX = 'auth_session'
  private readonly USER_SESSIONS_PREFIX = 'user_sessions'
  private readonly EXPIRATION_TIME = 86400

  async saveSesion (sesion: AuthSesion): Promise<void> {
    const sessionKey = `${this.SESSION_PREFIX}:${sesion.token}`
    const userSetKey = `${this.USER_SESSIONS_PREFIX}:${sesion.id_usuario}`

    await this.client.set(sessionKey, sesion.id_usuario.toString(), {
      EX: this.EXPIRATION_TIME
    })

    await this.client.sAdd(userSetKey, sesion.token)
    await this.client.expire(userSetKey, this.EXPIRATION_TIME)
  }

  async getUserIdByToken (token: string): Promise<number> {
    const sessionKey = `${this.SESSION_PREFIX}:${token}`
    const idUsuario = await this.client.get(sessionKey)

    return idUsuario != null ? parseInt(idUsuario) : 0
  }

  async closeSesion (token: string): Promise<void> {
    const sessionKey = `${this.SESSION_PREFIX}:${token}`

    const idUsuario = await this.client.get(sessionKey)

    if (idUsuario != null) {
      const userSetKey = `${this.USER_SESSIONS_PREFIX}:${idUsuario}`
      await Promise.all([
        this.client.del(sessionKey),
        this.client.sRem(userSetKey, token)
      ])
    }
  }

  async closeAllSesions (idUsuario: id_usuario): Promise<void> {
    const userSetKey = `${this.USER_SESSIONS_PREFIX}:${idUsuario}`

    const tokens = await this.client.sMembers(userSetKey)

    const deletePromises = tokens.map(async token =>
      await this.client.del(`${this.SESSION_PREFIX}:${token}`)
    )

    await Promise.all([
      ...deletePromises,
      this.client.del(userSetKey)
    ])
  }
}
