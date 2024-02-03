"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var crypto_1 = __importDefault(require("crypto"));
var regex_1 = require("../constants/regex");
var customError_1 = __importDefault(require("../handlers/customError"));
var errorMessages_1 = require("../constants/errorMessages");
var statusCodes_1 = require("../constants/statusCodes");
var AuthService = /** @class */ (function () {
    function AuthService(userRepository, userSessionService) {
        this.userRepository = userRepository;
        this.userSessionService = userSessionService;
    }
    // Finds a user by their email address. Validates the email format before querying the database.
    AuthService.prototype.findUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!regex_1.emailRegex.test(email))
                    throw new customError_1.default(errorMessages_1.AUTH_EMAIL_FORMAT, statusCodes_1.BAD_REQUEST);
                return [2 /*return*/, this.userRepository.findOne({
                        where: { email: email.toLowerCase() },
                    })];
            });
        });
    };
    // Validates if the email for signup and ensures it is not already in use.
    AuthService.prototype.isValidSignupEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var emailExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findUserByEmail(email)];
                    case 1:
                        emailExists = _a.sent();
                        if (emailExists)
                            throw new customError_1.default(errorMessages_1.AUTH_EMAIL_ALREADY_IN_USE, statusCodes_1.BAD_REQUEST);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Validates the email for login and ensures it exists.
    AuthService.prototype.isExistingEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new customError_1.default(errorMessages_1.AUTH_CREDENTIALS_INVALID, statusCodes_1.BAD_REQUEST);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // Validate the password format.
    AuthService.prototype.isValidPasswordFormat = function (password) {
        if (!regex_1.passwordRegex.test(password))
            throw new customError_1.default(errorMessages_1.AUTH_PASSWORD_FORMAT, statusCodes_1.BAD_REQUEST);
    };
    // Validate the password and checks if the password matches with the confirmPassword.
    AuthService.prototype.isValidNewPassword = function (password, confirmPassword) {
        this.isValidPasswordFormat(password);
        if (password !== confirmPassword)
            throw new customError_1.default(errorMessages_1.AUTH_PASSWORDS_DONT_MATCH, statusCodes_1.BAD_REQUEST);
    };
    // Validates the provided password against the user's stored password.
    AuthService.prototype.isValidExistingPassword = function (user, password) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!password)
                            throw new customError_1.default(errorMessages_1.AUTH_PASSWORD_MISSING, statusCodes_1.BAD_REQUEST);
                        return [4 /*yield*/, user.comparePassword(password)];
                    case 1:
                        isValidPassword = _a.sent();
                        if (!isValidPassword)
                            throw new customError_1.default(errorMessages_1.AUTH_CREDENTIALS_INVALID, statusCodes_1.BAD_REQUEST);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Method for validating the username.
    AuthService.prototype.isValidUsername = function (username) {
        if (!username || username.length < 2 || username.length > 30)
            throw new customError_1.default(errorMessages_1.AUTH_USERNAME_LENGTH, statusCodes_1.BAD_REQUEST);
    };
    // Signup function for user registration.
    AuthService.prototype.signup = function (_a) {
        var username = _a.username, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword;
        return __awaiter(this, void 0, void 0, function () {
            var user, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Validate email, password and username.
                    return [4 /*yield*/, this.isValidSignupEmail(email)];
                    case 1:
                        // Validate email, password and username.
                        _b.sent();
                        this.isValidNewPassword(password, confirmPassword);
                        this.isValidUsername(username);
                        user = this.userRepository.create({
                            email: email.toLowerCase(),
                            username: username,
                            password: password,
                        });
                        return [4 /*yield*/, this.userRepository.save(user)
                            // Generate a user session and get a refresh token.
                        ];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.userSessionService.createUserSession(user)];
                    case 3:
                        refreshToken = _b.sent();
                        return [2 /*return*/, {
                                accessToken: user.generateAccessToken(),
                                refreshToken: refreshToken,
                            }];
                }
            });
        });
    };
    // Login function for user login.
    AuthService.prototype.login = function (_a) {
        var email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.isExistingEmail(email)
                        // Validate the password.
                    ];
                    case 1:
                        user = _b.sent();
                        // Validate the password.
                        return [4 /*yield*/, this.isValidExistingPassword(user, password)
                            // Generate a user session and get a refresh token.
                        ];
                    case 2:
                        // Validate the password.
                        _b.sent();
                        return [4 /*yield*/, this.userSessionService.createUserSession(user)];
                    case 3:
                        refreshToken = _b.sent();
                        return [2 /*return*/, {
                                accessToken: user.generateAccessToken(),
                                refreshToken: refreshToken,
                            }];
                }
            });
        });
    };
    // Handles the renewal of access of and refresh tokens.
    AuthService.prototype.renewTokens = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var userSession, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userSessionService.findByToken(refreshToken)
                        // Find the user belonging to that session, throw an error if no user is found.
                    ];
                    case 1:
                        userSession = _a.sent();
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: {
                                    id: userSession.user.id,
                                },
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            throw new customError_1.default(errorMessages_1.AUTHENTICATION_REFRESH_TOKEN_INVALID, statusCodes_1.BAD_REQUEST);
                        // Remove the old userSession and refreshToken before you send the new tokens.
                        return [4 /*yield*/, this.userSessionService.deleteUserSession(userSession)];
                    case 3:
                        // Remove the old userSession and refreshToken before you send the new tokens.
                        _a.sent();
                        return [2 /*return*/, {
                                accessToken: user.generateAccessToken(),
                                refreshToken: user.generateRefreshToken(),
                            }];
                }
            });
        });
    };
    // Function for looking up and destroying a user session when logging out.
    AuthService.prototype.invalidateRefreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var userSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userSessionService.findByToken(refreshToken)];
                    case 1:
                        userSession = _a.sent();
                        return [4 /*yield*/, this.userSessionService.deleteUserSession(userSession)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Function that generates and adds the reset token on password request.
    AuthService.prototype.requestPasswordReset = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isExistingEmail(email)
                        // Create a reset token but store a hashed version on the user.
                    ];
                    case 1:
                        user = _a.sent();
                        resetToken = crypto_1.default.randomBytes(32).toString("hex");
                        user.resetToken = crypto_1.default
                            .createHash("sha256")
                            .update(resetToken)
                            .digest("hex");
                        // Set expiration to 10 minutes.
                        user.resetTokenExpiration = new Date(Date.now() + 10 * 60 * 1000);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                resetToken: resetToken,
                                email: user.email,
                            }];
                }
            });
        });
    };
    // Function that resets a users password.
    AuthService.prototype.resetPassword = function (_a) {
        var resetToken = _a.resetToken, password = _a.password, confirmPassword = _a.confirmPassword;
        return __awaiter(this, void 0, void 0, function () {
            var resetPasswordToken, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Throw an error if no resetToken is passed.
                        if (!resetToken)
                            throw new customError_1.default(errorMessages_1.RESET_TOKEN_INVALID_OR_EXPIRED, statusCodes_1.BAD_REQUEST);
                        resetPasswordToken = crypto_1.default
                            .createHash("sha256")
                            .update(resetToken)
                            .digest("hex");
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: {
                                    resetToken: resetPasswordToken,
                                    resetTokenExpiration: (0, typeorm_1.MoreThan)(new Date()),
                                },
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            throw new customError_1.default(errorMessages_1.RESET_TOKEN_INVALID_OR_EXPIRED, statusCodes_1.BAD_REQUEST);
                        // If user exists, do password validation.
                        this.isValidNewPassword(password, confirmPassword);
                        // Update users password, resetToken and expiration date.
                        user.password = password;
                        user.resetToken = null;
                        user.resetTokenExpiration = null;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.default = AuthService;
//# sourceMappingURL=authService.js.map