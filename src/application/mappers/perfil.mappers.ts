import { idiomaPerfil, type Perfil } from '../../domain/entities/Perfil.js'
import { DEFAULT_AVATAR_URL } from '../../CONSTS.js'
import type { RowDataPacket } from 'mysql2/promise'

const DEFAULT_IDIOMA_PERFIL = idiomaPerfil.esBO

export function mapPerfilResultToPerfil (perfil: Partial<Perfil>): Perfil {
  return {
    id_perfil: perfil.id_perfil ?? 0,
    id_usuario: perfil.id_usuario ?? 0,
    nombre: perfil.nombre ?? '',
    avatar_url: perfil.avatar_url ?? DEFAULT_AVATAR_URL,
    id_clasificacion_maxima: perfil.id_clasificacion_maxima ?? 0,
    idioma_preferido: perfil.idioma_preferido ?? DEFAULT_IDIOMA_PERFIL,
    modo_oscuro: perfil.modo_oscuro ?? true,
    fecha_creacion: new Date().toISOString()
  }
}

export function mapRowToPerfilList (row: RowDataPacket[]): Perfil[] {
  const data = (Array.isArray(row) ? row : [row]) as Array<Partial<Perfil>>

  return data.map((perfil) => ({
    id_perfil: perfil.id_perfil ?? 0,
    id_usuario: perfil.id_usuario ?? 0,
    nombre: perfil.nombre ?? '',
    avatar_url: perfil.avatar_url ?? DEFAULT_AVATAR_URL,
    id_clasificacion_maxima: perfil.id_clasificacion_maxima ?? 0,
    idioma_preferido: perfil.idioma_preferido ?? DEFAULT_IDIOMA_PERFIL,
    modo_oscuro: perfil.modo_oscuro ?? true,
    fecha_creacion: perfil.fecha_creacion ?? new Date().toISOString()
  }))
}
