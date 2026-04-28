import type { Request, Response } from 'express'
import { RegisterUser } from '../../../application/use-cases/auth/register-user.js'
import { LoginUser } from '../../../application/use-cases/auth/login-user.js'

export class UserController {
  constructor (private readonly registerUser: RegisterUser, private readonly loginUser: LoginUser) {}

  async register (req: Request, res: Response): Promise<void> {
    try {
      const user = await this.registerUser.execute({ ...req.body, password_hash: req.body.password })

      res.status(201).json({ user })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async login (req: Request, res: Response): Promise<void> {
    try {
      const user = await this.loginUser.execute(req.body)
      if (user == null) {
        res.status(500).json({ error: 'no se pudo iniciar sesion, intente de nuevo' })
        return
      }
      res.status(200).json({ user: user?.user, token: user?.token })
    } catch (e: any) {
      console.log(e)
      res.status(400).json({ error: e.message })
    }
  }
}
