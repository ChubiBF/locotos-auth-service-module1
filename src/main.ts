import express from 'express'
import dotenv from 'dotenv'
import userRouter from './infrastructure/http/Routes/user-router.js'
import cors from 'cors'
import perfilRouter from './infrastructure/http/Routes/perfil-router.js'
import emailRouter from './infrastructure/http/Routes/email-router.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', userRouter)
app.use('/api/perfil', perfilRouter)
app.use('/api/email', emailRouter)

app.get('/testing', (req, res) => {
  console.log('primera')
  res.send('<h1> HOLA BOLA</h1>')
})

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT: http://localhost:${PORT}`)
})
