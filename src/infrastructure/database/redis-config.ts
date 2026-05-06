import { createClient, type RedisClientType } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost'
const REDIS_PORT = process.env.REDIS_PORT ?? '6379'
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ''

const url = REDIS_PASSWORD !== ''
  ? `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
  : `redis://${REDIS_HOST}:${REDIS_PORT}`

const redisClient: RedisClientType = createClient({ url })

redisClient.on('error', (err) => console.error('redis Client Error:', err))

try {
  await redisClient.connect()
  console.log(`Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`)
} catch (error) {
  console.error('No se pudo conectar a Redis:', error)
}

export { redisClient }
