export interface IEmailCacheRepository {

  saveToken: (key: string, token: string, ttlSeconds: number) => Promise<void>

  getToken: (key: string) => Promise<string | null>

  deleteToken: (key: string) => Promise<void>
}
