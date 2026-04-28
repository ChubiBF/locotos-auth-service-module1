import { redisClient } from './redis-config.js'
import type { IEmailCacheRepository } from '../../domain/repositories/email-cache.repository.js'

export class RedisEmailRepository implements IEmailCacheRepository {
  private readonly VERIFY_PREFIX = 'verify:'
  private readonly RESET_PREFIX = 'reset:'

  async saveToken (key: string, token: string, ttlSeconds: number): Promise<void> {
    await redisClient.set(key, token, {
      EX: ttlSeconds
    })
  }

  async getToken (key: string): Promise<string | null> {
    return await redisClient.get(key)
  }

  async deleteToken (key: string): Promise<void> {
    await redisClient.del(key)
  }
}
