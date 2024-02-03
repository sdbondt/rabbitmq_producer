import { Repository } from "typeorm"
import { UserSession } from "../entity/UserSession"
import CustomError from "../handlers/customError"
import { AUTHENTICATION_REFRESH_TOKEN_INVALID, AUTHENTICATION_REFRESH_TOKEN_MISSING } from "../constants/errorMessages"
import { BAD_REQUEST } from "../constants/statusCodes"
import { User } from "../entity/User"

class UserSessionService {
    userSessionRepository: Repository<UserSession>

  constructor(userSessionRepository: Repository<UserSession>) {
    this.userSessionRepository = userSessionRepository
  }

  async findByToken(refreshToken: string): Promise<UserSession> {
    // Throw error if refreshToken is missing.
    if (!refreshToken)
      throw new CustomError(AUTHENTICATION_REFRESH_TOKEN_MISSING, BAD_REQUEST)

    // Find the associated user session for that refresh token.
    const userSession = await this.userSessionRepository.findOne({
      where: {
        refreshToken
      },
      relations: {
        user: true
      }
    })
    
    // If there is no session or it has expired, throw an error.
    if (!userSession || userSession.expiresAt < new Date())
          throw new CustomError(AUTHENTICATION_REFRESH_TOKEN_INVALID, BAD_REQUEST)
      return userSession
  }

  async createUserSession(user: User): Promise<string> {
       // Generate a new refresh token for that user.
    const refreshToken = user.generateRefreshToken()

    // Create and save a new user session.
    const userSession = this.userSessionRepository.create({
      user,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await this.userSessionRepository.save(userSession)
    return refreshToken
  }

  async deleteUserSession(userSession: UserSession): Promise<void> {
    await this.userSessionRepository.remove(userSession)
  }
}

export default UserSessionService
