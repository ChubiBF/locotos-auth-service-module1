import type { Request, Response } from 'express'
import { CreateProfile } from '../../../application/use-cases/perfil/create-profile.js'
import { GetProfilesByUser } from '../../../application/use-cases/perfil/get-profiles-by-user.js'
import { EditProfile } from '../../../application/use-cases/perfil/edit-profile.js'
import { DeleteProfile } from '../../../application/use-cases/perfil/delete-profile.js'

export class PerfilController {
  constructor (
    private readonly createProfile: CreateProfile,
    private readonly getProfiles: GetProfilesByUser,
    private readonly editProfile: EditProfile,
    private readonly deleteProfile: DeleteProfile
  ) {}

  async create (req: Request, res: Response): Promise<void> {
    try {
      const perfil = await this.createProfile.execute(req.body)
      res.status(201).json(perfil)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async getByUser (req: Request, res: Response): Promise<void> {
    try {
      const idUsuario = Number(req.params.id_usuario)
      const perfiles = await this.getProfiles.execute(idUsuario)
      res.status(200).json(perfiles)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async update (req: Request, res: Response): Promise<void> {
    try {
      const idPerfil = Number(req.params.id)
      const updated = await this.editProfile.execute(idPerfil, req.body)
      res.status(200).json(updated)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  async delete (req: Request, res: Response): Promise<void> {
    try {
      const idPerfil = Number(req.params.id)
      await this.deleteProfile.execute(idPerfil)
      res.status(200).json({ message: 'Perfil eliminado correctamente' })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }
}
