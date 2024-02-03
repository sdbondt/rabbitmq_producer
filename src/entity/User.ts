import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm"
import { Length, Matches } from "class-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {
  AUTH_EMAIL_FORMAT,
  AUTH_PASSWORD_FORMAT,
  AUTH_USERNAME_LENGTH,
} from "../constants/errorMessages"
import { emailRegex, passwordRegex } from "../constants/regex"
import { UserSession } from "./UserSession"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(2, 30, { message: AUTH_USERNAME_LENGTH })
  username: string

  @Column()
  @Matches(emailRegex, { message: AUTH_EMAIL_FORMAT })
  email: string

  @Column()
  @Matches(passwordRegex, { message: AUTH_PASSWORD_FORMAT })
  password: string

  @Column({
    nullable: true,
  })
  resetToken: string

  @Column({
    nullable: true
  })
  resetTokenExpiration: Date

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      // Hash the password before inserting or updating the user.
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
  }

  // Generate a JWT access token.
  generateAccessToken(): string {
    return jwt.sign({ userId: this.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    })
  }

  // Generate a JWT refresh token.
  generateRefreshToken(): string {
    return jwt.sign({ userId: this.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    })
  }

  // Compare the provided password with the user's hashed password.
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
