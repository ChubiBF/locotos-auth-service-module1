export interface SesionUsuario {
  id_sesion: number
  id_usuario: number
  token_mfa: string
  ultimo_acceso: string
  ip_origen: string
  dispositivo: string
}
