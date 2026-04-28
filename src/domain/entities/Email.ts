export interface VerificacionEmail {
  id_verificacion: number
  id_usuario: number
  token: string
  expira_en: Date
  creado_en: Date
}

export interface ResetPassword {
  id_reset: number
  id_usuario: number
  token: string
  expira_en: Date
  creado_en: Date
  usado: boolean
}
