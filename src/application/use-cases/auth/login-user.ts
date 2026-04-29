import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UsuarioBasic } from '../../dtos/usuario.dto.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import { mapUsuarioToUsuarioBasic } from '../../mappers/usuario.mappers.js'
import type { LoginInputDto } from '../../dtos/auth.dto.js'
import type { ISessionRepository } from '../../../domain/repositories/sesion.repository.js'

export class LoginUser {
  constructor (private readonly userRepository: IUserRepository,
    private readonly sesionRepository: ISessionRepository
  ) { }

  async execute (data: LoginInputDto): Promise<{ user: UsuarioBasic, token: string }> {
    try {
      // por email
      const usuario = await this.userRepository.findByEmail(data.correo)
      if (usuario == null) throw new Error(`no existe el correo ${data.correo}`)

      // validar password
      const validPassword = await bcrypt.compare(data.password, usuario.password_hash)
      if (!validPassword) throw new Error('la contrasena es incorrecta')

      const privateKey = process.env.JWT_SECRET
      if (privateKey === undefined) throw new Error('El token no esta definido')
      const token = jwt.sign({ id: usuario.id_usuario, tipo: usuario.tipo_usuario }, privateKey, { expiresIn: '24h' })

      await this.sesionRepository.save({ id_usuario: usuario.id_usuario, ip_origen: data.ip, dispositivo: data.dispositivo })

      return {
        user: mapUsuarioToUsuarioBasic(usuario),
        token
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
