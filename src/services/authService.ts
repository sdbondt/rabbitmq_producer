import { MoreThan, Repository } from "typeorm"
import crypto from "crypto"
import { User } from "../entity/User"
import { emailRegex, passwordRegex } from "../constants/regex"
import {
  AuthResponse,
  LoginPayload,
  PasswordRequestResponse,
  PasswordResetPayload,
  SignupPayload,
} from "../types/authTypes"
import CustomError from "../handlers/customError"
import {
  AUTHENTICATION_REFRESH_TOKEN_INVALID,
  AUTH_CREDENTIALS_INVALID,
  AUTH_EMAIL_ALREADY_IN_USE,
  AUTH_EMAIL_FORMAT,
  AUTH_PASSWORDS_DONT_MATCH,
  AUTH_PASSWORD_FORMAT,
  AUTH_PASSWORD_MISSING,
  AUTH_USERNAME_LENGTH,
  RESET_TOKEN_INVALID_OR_EXPIRED,
} from "../constants/errorMessages"
import { BAD_REQUEST } from "../constants/statusCodes"
import UserSessionService from "./userSessionService"

class AuthService {
  private userRepository: Repository<User>
  private userSessionService: UserSessionService

  constructor(
    userRepository: Repository<User>,
    userSessionService: UserSessionService
  ) {
    this.userRepository = userRepository
    this.userSessionService = userSessionService
  }

  // Finds a user by their email address. Validates the email format before querying the database.
  async findUserByEmail(email: string): Promise<User> {
    if (!emailRegex.test(email))
      throw new CustomError(AUTH_EMAIL_FORMAT, BAD_REQUEST)
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    })
  }

  // Validates if the email for signup and ensures it is not already in use.
  async isValidSignupEmail(email: string): Promise<void> {
    const emailExists = await this.findUserByEmail(email)
    if (emailExists)
      throw new CustomError(AUTH_EMAIL_ALREADY_IN_USE, BAD_REQUEST)
  }

  // Validates the email for login and ensures it exists.
  async isExistingEmail(email: string): Promise<User> {
    const user = await this.findUserByEmail(email)
    if (!user) throw new CustomError(AUTH_CREDENTIALS_INVALID, BAD_REQUEST)
    return user
  }

  // Validate the password format.
  isValidPasswordFormat(password: string): void {
    if (!passwordRegex.test(password))
      throw new CustomError(AUTH_PASSWORD_FORMAT, BAD_REQUEST)
  }

  // Validate the password and checks if the password matches with the confirmPassword.
  isValidNewPassword(
    password: string,
    confirmPassword: string
  ): void {
    this.isValidPasswordFormat(password)
    if (password !== confirmPassword)
      throw new CustomError(AUTH_PASSWORDS_DONT_MATCH, BAD_REQUEST)
  }

  // Validates the provided password against the user's stored password.
  async isValidExistingPassword(user: User, password: string): Promise<void> {
    if (!password) throw new CustomError(AUTH_PASSWORD_MISSING, BAD_REQUEST)
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword)
      throw new CustomError(AUTH_CREDENTIALS_INVALID, BAD_REQUEST)
  }

  // Method for validating the username.
  isValidUsername(username: string): void {
    if (!username || username.length < 2 || username.length > 30)
      throw new CustomError(AUTH_USERNAME_LENGTH, BAD_REQUEST)
  }

  // Signup function for user registration.
  async signup({
    username,
    email,
    password,
    confirmPassword,
  }: SignupPayload): Promise<AuthResponse> {
    // Validate email, password and username.
    await this.isValidSignupEmail(email)
    this.isValidNewPassword(password, confirmPassword)
    this.isValidUsername(username)

    // Create a new user and save to the database.
    const user = this.userRepository.create({
      email: email.toLowerCase(),
      username,
      password,
    })
    await this.userRepository.save(user)

    // Generate a user session and get a refresh token.
    const refreshToken = await this.userSessionService.createUserSession(user)

    return {
      accessToken: user.generateAccessToken(),
      refreshToken,
    }
  }

  // Login function for user login.
  async login({ email, password }: LoginPayload): Promise<AuthResponse> {
    // Validate the email and fetch the user.
    const user = await this.isExistingEmail(email)

    // Validate the password.
    await this.isValidExistingPassword(user, password)

    // Generate a user session and get a refresh token.
    const refreshToken = await this.userSessionService.createUserSession(user)

    return {
      accessToken: user.generateAccessToken(),
      refreshToken,
    }
  }

  // Handles the renewal of access of and refresh tokens.
  async renewTokens(refreshToken: string): Promise<AuthResponse> {
    const userSession = await this.userSessionService.findByToken(refreshToken)
    const newAccessToken = userSession.user.generateAccessToken()
    const newRefreshToken = userSession.user.generateRefreshToken()

    // Remove the old userSession and refreshToken before you send the new tokens.
    await this.userSessionService.deleteUserSession(userSession)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  // Function for looking up and destroying a user session when logging out.
  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    const userSession = await this.userSessionService.findByToken(refreshToken)
    await this.userSessionService.deleteUserSession(userSession)
  }

  // Function that generates and adds the reset token on password request.
  async requestPasswordReset(email: string): Promise<PasswordRequestResponse> {
    // Find the user.
    const user = await this.isExistingEmail(email)

    // Create a reset token but store a hashed version on the user.
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // Set expiration to 10 minutes.
    user.resetTokenExpiration = new Date(Date.now() + 10 * 60 * 1000)
    await this.userRepository.save(user)
    return {
      resetToken,
      email: user.email,
    }
  }

  // Function that resets a users password.
  async resetPassword({
    resetToken,
    password,
    confirmPassword,
  }: PasswordResetPayload): Promise<void> {
    // Throw an error if no resetToken is passed.
    if (!resetToken)
      throw new CustomError(RESET_TOKEN_INVALID_OR_EXPIRED, BAD_REQUEST)

    // Look for a user with a corresponding hashed version of the resetToken.
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    const user = await this.userRepository.findOne({
      where: {
        resetToken: resetPasswordToken,
        resetTokenExpiration: MoreThan(new Date()),
      },
    })
    if (!user)
      throw new CustomError(RESET_TOKEN_INVALID_OR_EXPIRED, BAD_REQUEST)

    // If user exists, do password validation.
    this.isValidNewPassword(password, confirmPassword)

    // Update users password, resetToken and expiration date.
    user.password = password
    user.resetToken = null
    user.resetTokenExpiration = null
    await this.userRepository.save(user)
  }
}

export default AuthService
