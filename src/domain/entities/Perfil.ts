export enum idiomaPerfil {
  esBO = 'es-BO',
  esES = 'es-ES',
  enUS = 'en-US',
  ptBR = 'pt-BR',
  frFR = 'fr-FR'
}

export interface Perfil {
  id_perfil: number
  id_usuario: number
  nombre: string
  avatar_url: string
  id_clasificacion_maxima: number
  idioma_preferido: idiomaPerfil
  modo_oscuro: boolean
  fecha_creacion: string
}

export interface PerfilToRegister extends Omit<Perfil, 'id_perfil' | 'fecha_creacion'> {}
