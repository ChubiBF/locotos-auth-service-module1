import { z } from 'zod'
import { requiredOrFilled } from './other-validations.js'

export const forgotPasswordSchema = z.object({
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' }))
})

export const resetPasswordSchema = z.object({
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' })),
  token: z.string({ error: requiredOrFilled }),
  newPassword: z.string({ error: requiredOrFilled }).min(8, 'la contrasena debe tener como minimo 8 caracteres')
    .max(255, '')
    .regex(/[A-Z]/, 'la contrasena debe contener al menos una mayuscula')
    .regex(/[a-z]/, 'la contrasena debe contener al menos una minuscula')
    .regex(/[0-9]/, 'la contrasena debe contener al menos un numero')
})

export const verifyEmailSchema = z.object({
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' })),
  code: z.string({ error: requiredOrFilled }).length(6, 'El código debe ser de 6 dígitos')
})

export const sendVerificationSchema = z.object({
  correo: z.string({ error: requiredOrFilled })
    .min(1, { error: 'Email es requerido' }).max(100)
    .pipe(z.email({ error: 'Email no es valido' }))
})
