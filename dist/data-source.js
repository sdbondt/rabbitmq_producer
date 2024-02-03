"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSessionRepository = exports.userRepository = exports.TestDataSource = exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var User_1 = require("./entity/User");
var getRepository_1 = __importDefault(require("./utils/getRepository"));
var UserSession_1 = require("./entity/UserSession");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User_1.User, UserSession_1.UserSession],
    migrations: [],
    subscribers: [],
});
exports.TestDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_TEST_DATABASE,
    entities: [User_1.User],
    synchronize: true,
    logging: false,
});
exports.userRepository = (0, getRepository_1.default)(User_1.User);
exports.userSessionRepository = (0, getRepository_1.default)(UserSession_1.UserSession);
//# sourceMappingURL=data-source.js.map