import { z } from 'zod'
import { estadoUsuario, tipoUsuario } from '../../../domain/entities/Usuario.js'
import { requiredOrFilled } from './other-validations.js'

export const registerSchema = z.object({
  nombre: z.string({ error: requiredOrFilled }).min(3).max(100),
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' })),
  password: z.string({ error: requiredOrFilled }).min(8, 'la contrasena debe tener como minimo 8 caracteres')
    .max(255, '')
    .regex(/[A-Z]/, 'la contrasena debe contener al menos una mayuscula')
    .regex(/[a-z]/, 'la contrasena debe contener al menos una minuscula')
    .regex(/[0-9]/, 'la contrasena debe contener al menos un numero'),
  tipo_usuario: z.string({ error: requiredOrFilled }).pipe(z.enum(tipoUsuario, 'ingresa un tipo de usuario valido')),
  estado: z.string({ error: requiredOrFilled }).pipe(z.enum(estadoUsuario, 'ingresa un estado de usuario valido'))
})

export const loginSchema = z.object({
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' })),
  password: z.string({ error: requiredOrFilled })
})
