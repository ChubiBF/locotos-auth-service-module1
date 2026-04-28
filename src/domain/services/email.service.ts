export interface IEmailService {
  sendWelcomeEmail: (to: string, nombre: string) => Promise<void>
}
