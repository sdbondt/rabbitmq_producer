import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/statusCodes";
import { IError } from "../types/errorType";

const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  // Determine if error has a message and statuscode, if not add default options.
  let customError = {
    statusCode: 'statusCode' in err ? err.statusCode : INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later',
  }
  // Return the error response.
  console.log(customError.message)
  return res.status(customError.statusCode).json({ message: customError.message })
}

export default errorHandler