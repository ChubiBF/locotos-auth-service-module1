import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UsuarioBasic } from '../../dtos/usuario.dto.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import { mapUsuarioToUsuarioBasic } from '../../mappers/usuario.mappers.js'
import type { LoginInputDto } from '../../dtos/auth.dto.js'

export class LoginUser {
  constructor (private readonly userRepository: IUserRepository) {}

  async execute (data: LoginInputDto): Promise < { user: UsuarioBasic, token: string } | null> {
    // find the user by email
    const usuario = await this.userRepository.findByEmail(data.correo)
    if (usuario == null) throw new Error(`no existe el correo ${data.correo}`)

    // validate password
    const validPassword = await bcrypt.compare(data.password, usuario.password_hash)
    if (!validPassword) throw new Error('la contrasena es incorrecta')

    const privateKey = process.env.JWT_SECRET
    if (privateKey === undefined) throw new Error('El token no esta definido')
    const token = jwt.sign({ id: usuario.id_usuario, tipo: usuario.tipo_usuario }, privateKey, { expiresIn: '24h' })

    return {
      user: mapUsuarioToUsuarioBasic(usuario),
      token
    }
  }
}
