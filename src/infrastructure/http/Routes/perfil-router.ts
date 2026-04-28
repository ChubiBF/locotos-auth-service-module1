import { Router } from 'express'
import { perfilController } from '../../container.js'
import { validateUser } from '../helpers/user-helper.js'
import { createPerfilSchema, updatePerfilSchema } from '../schemas/perfil-schema.js'

const perfilRouter: Router = Router()

perfilRouter.post('/', validateUser(createPerfilSchema), async (req, res) => await perfilController.create(req, res))

perfilRouter.get('/user/:id_usuario', async (req, res) => await perfilController.getByUser(req, res))

perfilRouter.patch('/:id', validateUser(updatePerfilSchema), async (req, res) => await perfilController.update(req, res))

perfilRouter.delete('/:id', async (req, res) => await perfilController.delete(req, res))

export default perfilRouter
