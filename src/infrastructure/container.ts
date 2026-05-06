import { createPool } from 'mysql2/promise'

// cofig
import { connectionConfig } from './database/mysql-config.js'
import { RedisEmailRepository } from './database/redis-email.repository.js'
import { EmailService } from './email/email.service.js'

// repos
import { MySQLUserRepository } from './database/mysql-user.repository.js'
import { MySQLPerfilRepository } from './database/mysql-perfil.repository.js'
import { MySQLSessionRepository } from './database/mysql-session.repository.js'

// controllers
import { RegisterUser } from '../application/use-cases/auth/register-user.js'
import { UserController } from './http/Controllers/user-controller.js'
import { PerfilController } from './http/Controllers/perfil-controller.js'
import { EmailController } from './http/Controllers/email-controller.js'

// use cases
import { LoginUser } from '../application/use-cases/auth/login-user.js'
import { CreateProfile } from '../application/use-cases/perfil/create-profile.js'
import { GetProfilesByUser } from '../application/use-cases/perfil/get-profiles-by-user.js'
import { EditProfile } from '../application/use-cases/perfil/edit-profile.js'
import { DeleteProfile } from '../application/use-cases/perfil/delete-profile.js'
import { RequestPasswordReset } from '../application/use-cases/email/request-password-reset.js'
import { ResetPassword } from '../application/use-cases/email/reset-password.js'
import { VerifyEmail } from '../application/use-cases/email/verify-email.js'
import { SendVerificationEmail } from '../application/use-cases/email/send-verify-email.js'
import { RedisAuthSesionRepository } from './database/redis-auth-sesion.repository.js'
import { LogoutUser } from '../application/use-cases/auth/logout-user.js'
import { ValidateSession } from '../application/use-cases/auth/validate-sesion.js'
import { AuthController } from './http/Controllers/auth-controller.js'

const pool = createPool({
  ...connectionConfig
})

// REPOSITORIOS -----------------------------------------------
// user
const userRepository = new MySQLUserRepository(pool)
const sessionRepository = new MySQLSessionRepository(pool)
// email
const emailCacheRepository = new RedisEmailRepository()
const emailService = new EmailService()
// auth de validacion de sesiones
const authSesionRepository = new RedisAuthSesionRepository()

// -----------------------------------------------USER  //
// use cases
const registerUser = new RegisterUser(userRepository, emailCacheRepository, emailService)
const loginUser = new LoginUser(userRepository, sessionRepository, authSesionRepository)

// controlador
const userController = new UserController(registerUser, loginUser)

/// ------------- PARA LOS PERFILES ///
const perfilRepository = new MySQLPerfilRepository(pool)

// use cases
const createProfile = new CreateProfile(perfilRepository, userRepository)
const getProfiles = new GetProfilesByUser(perfilRepository, userRepository)
const editProfile = new EditProfile(perfilRepository)
const deleteProfile = new DeleteProfile(perfilRepository)

// Controlador
const perfilController = new PerfilController(createProfile, getProfiles, editProfile, deleteProfile)

// ------------------ PARA LOS ENVIOS DE CORREOS ///
// uses cases
const requestPasswordReset = new RequestPasswordReset(userRepository, emailCacheRepository, emailService)
const resetPassword = new ResetPassword(userRepository, emailCacheRepository)
const verifyEmail = new VerifyEmail(userRepository, emailCacheRepository)
const sendVerificationEmail = new SendVerificationEmail(userRepository, emailCacheRepository, emailService)

// controller
const emailController = new EmailController(requestPasswordReset, resetPassword, verifyEmail, sendVerificationEmail)

// -------------- PARA AUTH DE SESIONES /////
// use cases
const logoutUser = new LogoutUser(authSesionRepository)
const validate = new ValidateSession(authSesionRepository)
// controller
const authController = new AuthController(validate, logoutUser)
// ---- export///
export {
  userController,
  perfilController,
  emailController,
  authController
}
