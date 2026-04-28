import type { Perfil } from '../entities/Perfil.js'

export interface IperfilRepository {
  save: (perfil: Partial<Perfil>) => Promise<Perfil | null>
  findByUsuarioId: (usuarioId: number) => Promise<Perfil[]>
  delete: (id: number) => Promise<boolean>
  update: (id: number, data: Partial<Perfil>) => Promise<Perfil | null>
  findById: (id: number) => Promise<Perfil | null>
}
