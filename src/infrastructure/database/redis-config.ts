import { createClient, type RedisClientType } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

// Configuramos los parámetros usando variables de entorno como en MySQL
const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost'
const REDIS_PORT = process.env.REDIS_PORT ?? '6379'
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ''

// Construimos la URL de conexión
const url = REDIS_PASSWORD !== ''
  ? `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
  : `redis://${REDIS_HOST}:${REDIS_PORT}`

const redisClient: RedisClientType = createClient({ url })

// Manejo de errores para que no tumbe el servidor
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err))

// Conexión inmediata al importar (top-level await permitido en tu config)
try {
  await redisClient.connect()
  console.log(`Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`)
} catch (error) {
  console.error('No se pudo conectar a Redis:', error)
}

export { redisClient }
