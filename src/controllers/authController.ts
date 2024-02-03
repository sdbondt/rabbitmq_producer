import { Request, Response } from "express"
import asyncHandler from "../handlers/asyncHandler"
import AuthService from "../services/authService"
import { userRepository, userSessionRepository } from "../data-source"
import { CREATED, OK } from "../constants/statusCodes"
import UserSessionService from "../services/userSessionService"
import { sendMessage } from "../RabbitMqProducer"

const userSessionService = new UserSessionService(userSessionRepository)
const authService = new AuthService(userRepository, userSessionService)

// Signup route handler.
export const signup = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    // Register a new user and fetch the access and refresh token.
    const { accessToken, refreshToken } = await authService.signup(req.body)

    // Send an email to regustered email address.
    sendMessage('userRegistration', {
      email: req.body.email
    })
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    res.status(CREATED).json({ accessToken })
  }
)

// Login route hander.
export const login = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    // Login the user and fetch the access and refresh tokens.
    const { accessToken, refreshToken } = await authService.login(req.body)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    res.status(OK).json({ accessToken })
  }
)

// Refresh token route handler.
export const refreshToken = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    // Extract the refreshtoken from the request cookies.
    const oldRefreshToken = req.cookies["refreshToken"]
    const { accessToken, refreshToken } = await authService.renewTokens(
      oldRefreshToken
    )
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })

    res.status(OK).json({ accessToken })
  }
)

// Logout route handler.
export const logout = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    // Extract the refreshtoken from the request cookies.
    const refreshToken = req.cookies["refreshToken"]
    await authService.invalidateRefreshToken(refreshToken)
    res.status(OK).send()
  }
)

// Password reset request handler.
export const forgotPassword = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    const resetRequest = await authService.requestPasswordReset(req.body.email)
    sendMessage('passwordReset', resetRequest)
    res.status(OK).json({ resetRequest })
  }
)

// Password reset handler.
export const resetPassword = asyncHandler<Request>(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body)
    res.status(OK).send()
  }
)
