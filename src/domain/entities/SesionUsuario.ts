export type id_usuario = number

export interface SesionUsuario {
  id_sesion?: number
  id_usuario: id_usuario
  token_mfa?: string
  ultimo_acceso?: string
  ip_origen: string
  dispositivo: string
}
