import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// verificar si funciona
transporter.verify((error, success) => {
  if (error != null) {
    console.log('Error en configuración de email:', error)
  } else {
    console.log('Servidor de correos listo para enviar')
  }
})
