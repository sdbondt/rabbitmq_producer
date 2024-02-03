import { NextFunction, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import asyncHandler from "../handlers/asyncHandler"
import CustomError from "../handlers/customError"
import {
  AUTHENTICATION_REQUIRED,
  AUTHENTICATION_INVALID,
} from "../constants/errorMessages"
import { UNAUTHORIZED } from "../constants/statusCodes"
import { userRepository } from "../data-source"
import { AuthRequest } from "../types/requestTypes"

const auth = asyncHandler<AuthRequest>(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Extract auth header from the request and verify it's the right format.
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError(AUTHENTICATION_REQUIRED, UNAUTHORIZED)

    // Extract token from the auth Header.
    const token = authHeader.split(" ")[1]
    if (!token) throw new CustomError(AUTHENTICATION_REQUIRED, UNAUTHORIZED)

    // Define an empy payload object of the type jwt payload.
    let payload: JwtPayload = {}

    // Verify the jwt token and cast it to the payload object.
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload
    } catch {
        throw new CustomError(AUTHENTICATION_INVALID, UNAUTHORIZED)
    }

    // Throw error if payload doesn't exist or isn't the right format.
    if (!payload || typeof payload !== 'object' || !payload.userId)
      throw new CustomError(AUTHENTICATION_INVALID, UNAUTHORIZED)

    // Retrieve user from database based on payload userId.
    const user = await userRepository.findOne({
      where: {
        id: payload.userId,
      },
    })

    // Throw error if no user exists.
    if (!user) throw new CustomError(AUTHENTICATION_INVALID, UNAUTHORIZED)

    // Append user to the request object for further use.
    req.user = user
    next()
  }
)

export default auth
