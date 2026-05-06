import type { Request, Response } from 'express'
import type { ValidateSession } from '../../../application/use-cases/auth/validate-sesion.js'
import type { LogoutUser } from '../../../application/use-cases/auth/logout-user.js'

export class AuthController {
  constructor (private readonly validateSessionUseCase: ValidateSession,
    private readonly logoutUser: LogoutUser
  ) {}

  async validateSession (req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    try {
      const result = await this.validateSessionUseCase.execute(token ?? '')

      if (result.valid) {
        return res.status(200).json(result)
      } else {
        return res.status(401).json(result)
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  async logout (req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    try {
      if (token === undefined) return res.status(400).json({ error: 'no se envio ningun token, envie el token' })
      const result = await this.logoutUser.execute(token)

      if (!result) return res.status(400).json({ error: 'no se pudo cerrar la sesion, envie un token' })
      return res.status(200).json({ message: 'se cerro la sesion exitosamente' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ error: 'ocurrio un error, no se pudo cerrar la sesion' })
    }
  }
}
