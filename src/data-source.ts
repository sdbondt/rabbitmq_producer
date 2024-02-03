import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import handleGetRepository from "./utils/getRepository"
import { UserSession } from "./entity/UserSession"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, UserSession],
    migrations: [],
    subscribers: [],
})

export const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_TEST_DATABASE,
    entities: [User],
    synchronize: true,
    logging: false,
})

export const userRepository = handleGetRepository(User)
export const userSessionRepository = handleGetRepository(UserSession)

