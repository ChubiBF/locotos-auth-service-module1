import { z } from 'zod'
import { requiredOrFilled } from './other-validations.js'
import { idiomaPerfil } from '../../../domain/entities/Perfil.js'

export const createPerfilSchema = z.object({
  id_usuario: z.number({ error: requiredOrFilled }).int().positive(),
  nombre: z.string({ error: requiredOrFilled }).min(2, 'El nombre es muy corto').max(50),
  avatar_url: z.string({ error: requiredOrFilled }).url('Debe ser una URL válida').optional(),
  id_clasificacion_maxima: z.number({ error: requiredOrFilled }).int()
    .min(1, 'La clasificación mínima es 1 (ATP)')
    .max(4, 'La clasificación máxima es 4 (18+)'),
  idioma_preferido: z.string({ error: requiredOrFilled }).pipe(z.enum(idiomaPerfil, 'ingresa un idioma valido ej. es-BO')),
  modo_oscuro: z.boolean().default(true)
})

export const updatePerfilSchema = createPerfilSchema.partial()
