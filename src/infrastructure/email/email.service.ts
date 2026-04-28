import { transporter } from './email-config.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = path.dirname(fileURLToPath(import.meta.url))

export class EmailService {
  private async getTemplate (templateName: string, replacements: Record<string, string>): Promise<string | null> {
    try {
      const filePath = path.join(_dirname, 'email-templates', `${templateName}.html`)
      let content = await fs.readFile(filePath, 'utf-8')

      Object.entries(replacements).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}`, 'g'), value)
      })

      return content
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async sendEmail ({ to, subject = 'hola te enviamos un correo', html }: { to: string, subject: string, html: string }): Promise<void> {
    try {
      if (process.env.EMAIL_USER === undefined || html == null) return
      await transporter.sendMail({
        from: `Locotos Streaming <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      })
    } catch (e) {
      console.log(e)
    }
  }

  async sendVerificationEmail (to: string, nombre: string, codigo: string): Promise<void> {
    try {
      const html = await this.getTemplate('verification', { nombre, codigo })
      if (html == null) return
      const subject = 'Verifica tu correo y estaras listo!'
      await this.sendEmail({ to, subject, html })
    } catch (e) {
      console.log(e)
    }
  }

  async sendPasswordResetEmail (to: string, nombre: string, enlace: string): Promise<void> {
    try {
      const html = await this.getTemplate('password-reset', { nombre, enlace_reset: enlace })
      if (html == null) return
      await this.sendEmail({ to, subject: 'reestablecer contrasena', html })
    } catch (e) {
      console.log(e)
    }
  }

  async sendWelcomeEmail (to: string, nombre: string, enlace: string): Promise<void> {
    try {
      const html = await this.getTemplate('welcome', { nombre, enlace_app: enlace })
      if (html == null) return
      await this.sendEmail({ to, subject: 'Bienvenida a la plataforma de Locotos!', html })
    } catch (e) {
      console.log(e)
    }
  }
}
