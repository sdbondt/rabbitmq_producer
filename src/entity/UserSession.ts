import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class UserSession {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
        () => User,
        user => user.sessions
    )
    user: User

    @Index()
    @Column()
    refreshToken: string

    @Index()
    @Column('timestamp')
    expiresAt: Date
}
