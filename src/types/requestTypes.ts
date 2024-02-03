import { Request } from "express";
import { User } from "../entity/User";

export interface AuthRequest extends Request {
    user: User
}