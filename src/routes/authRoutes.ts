import express from 'express'
import { FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, REFRESH_TOKEN_ROUTE, RESET_PASSWORD_ROUTE, SIGNUP_ROUTE } from '../constants/routes'
import { forgotPassword, login, logout, refreshToken, resetPassword, signup } from '../controllers/authController'

const router = express.Router()

// Route for user registration.
router.post(SIGNUP_ROUTE, signup)

// Route for user authentication.
router.post(LOGIN_ROUTE, login)

// Route for refreshing access token.
router.post(REFRESH_TOKEN_ROUTE, refreshToken)

// Route for logging out => destroy refresh token and userSession.
router.post(LOGOUT_ROUTE, logout)

// Route for requesting a password reset.
router.post(FORGOT_PASSWORD_ROUTE, forgotPassword)

// Route for resetting the user password.
router.post(RESET_PASSWORD_ROUTE, resetPassword)

export default router