import { createPool } from 'mysql2/promise'
import { MySQLUserRepository } from './database/mysql-user.repository.js'
import { RegisterUser } from '../application/use-cases/auth/register-user.js'
import { UserController } from './http/Controllers/user-controller.js'
import { connectionConfig } from './database/mysql-config.js'
import { LoginUser } from '../application/use-cases/auth/login-user.js'
import { MySQLPerfilRepository } from './database/mysql-perfil.repository.js'
import { CreateProfile } from '../application/use-cases/perfil/create-profile.js'
import { GetProfilesByUser } from '../application/use-cases/perfil/get-profiles-by-user.js'
import { EditProfile } from '../application/use-cases/perfil/edit-profile.js'
import { DeleteProfile } from '../application/use-cases/perfil/delete-profile.js'
import { PerfilController } from './http/Controllers/perfil-controller.js'
import { RedisEmailRepository } from './database/redis-email.repository.js'
import { EmailService } from './email/email.service.js'
import { RequestPasswordReset } from '../application/use-cases/email/request-password-reset.js'
import { ResetPassword } from '../application/use-cases/email/reset-password.js'
import { VerifyEmail } from '../application/use-cases/email/verify-email.js'
import { EmailController } from './http/Controllers/email-controller.js'
import { SendVerificationEmail } from '../application/use-cases/email/send-verify-email.js'

const pool = createPool({
  ...connectionConfig
})

// ------PARA EL USER ////
// Repository
const userRepository = new MySQLUserRepository(pool)

// Use-case
const registerUser = new RegisterUser(userRepository)
const loginUser = new LoginUser(userRepository)

// Controller
const userController = new UserController(registerUser, loginUser)

/// ------------- PARA LOS PERFILES ///
const perfilRepository = new MySQLPerfilRepository(pool)

// Casos de Uso de Perfil
const createProfile = new CreateProfile(perfilRepository, userRepository)
const getProfiles = new GetProfilesByUser(perfilRepository, userRepository)
const editProfile = new EditProfile(perfilRepository)
const deleteProfile = new DeleteProfile(perfilRepository)

// Controlador
const perfilController = new PerfilController(createProfile, getProfiles, editProfile, deleteProfile)

/// / ------------ PARA LOS CORREOS ////
const emailCacheRepository = new RedisEmailRepository()
const emailService = new EmailService()

const requestPasswordReset = new RequestPasswordReset(userRepository, emailCacheRepository, emailService)
const resetPassword = new ResetPassword(userRepository, emailCacheRepository)
const verifyEmail = new VerifyEmail(userRepository, emailCacheRepository)
const sendVerificationEmail = new SendVerificationEmail(userRepository, emailCacheRepository, emailService)

const emailController = new EmailController(requestPasswordReset, resetPassword, verifyEmail, sendVerificationEmail)

// ---- export///
export {
  userController,
  perfilController,
  emailController
}
