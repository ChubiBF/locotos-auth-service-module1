import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

import type { UsuarioToRegister } from '../../dtos/usuarioRegister.dto.js'
import type { UsuarioBasic } from '../../dtos/usuario.dto.js'
import type { IUserRepository } from '../../../domain/repositories/user.repository.js'
import { mapUsuarioToUsuarioBasic } from '../../mappers/usuario.mappers.js'
import { estadoUsuario } from '../../../domain/entities/Usuario.js'
import type { IEmailCacheRepository } from '../../../domain/repositories/email-cache.repository.js'
import type { EmailService } from '../../../infrastructure/email/email.service.js'

export class RegisterUser {
  constructor (private readonly userRepository: IUserRepository,
    private readonly emailCacheRepository: IEmailCacheRepository,
    private readonly emailService: EmailService
  ) {}

  async execute (data: UsuarioToRegister): Promise<UsuarioBasic | null> {
    try {
      const existing = await this.userRepository.findByEmail(data.correo)
      if (existing != null) throw new Error('el correo ya esta registrado')

      data.estado = estadoUsuario.pendiente_verificacion

      // bcrypt
      const password = await bcrypt.hash(data.password_hash, 10)

      const usuario = await this.userRepository.save({ ...data, password_hash: password })

      if (usuario == null) {
        throw new Error('no se pudo crear el usuario')
      }

      if (usuario.estado === estadoUsuario.activo) {
        throw new Error('Esta cuenta ya ha sido verificada')
      }

      const code = crypto.randomInt(100000, 999999).toString()

      await this.emailCacheRepository.saveToken(`verify:${usuario.correo}`, code, 900)

      await this.emailService.sendVerificationEmail(usuario.correo, usuario.nombre, code)
      return mapUsuarioToUsuarioBasic(usuario)
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
