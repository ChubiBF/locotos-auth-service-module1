import { Router } from 'express'

import { userController, authController } from '../../container.js'
import { validateUser } from '../helpers/user-helper.js'
import { loginSchema, registerSchema } from '../schemas/user-schema.js'

const userRouter: Router = Router()
userRouter.get('/validate-session', async (req, res) => await authController.validateSession(req, res))

userRouter.post('/login', validateUser(loginSchema), async (req, res) => await userController.login(req, res))

userRouter.post('/logout', async (req, res) => await authController.logout(req, res))

userRouter.post('/register', validateUser(registerSchema), async (req, res) => await userController.register(req, res))

userRouter.use((req, res) => {
  res.status(404).json('404: no se econtro ningun recurso')
})
export default userRouter
