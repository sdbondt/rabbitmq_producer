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
var customError_1 = __importDefault(require("../handlers/customError"));
var errorMessages_1 = require("../constants/errorMessages");
var statusCodes_1 = require("../constants/statusCodes");
var UserSessionService = /** @class */ (function () {
    function UserSessionService(userSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }
    UserSessionService.prototype.findByToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var userSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Throw error if refreshToken is missing.
                        if (!refreshToken)
                            throw new customError_1.default(errorMessages_1.AUTHENTICATION_REFRESH_TOKEN_MISSING, statusCodes_1.BAD_REQUEST);
                        return [4 /*yield*/, this.userSessionRepository.findOne({
                                where: {
                                    refreshToken: refreshToken
                                },
                                relations: {
                                    user: true
                                }
                            })
                            // If there is no session or it has expired, throw an error.
                        ];
                    case 1:
                        userSession = _a.sent();
                        // If there is no session or it has expired, throw an error.
                        if (!userSession || userSession.expiresAt < new Date())
                            throw new customError_1.default(errorMessages_1.AUTHENTICATION_REFRESH_TOKEN_INVALID, statusCodes_1.BAD_REQUEST);
                        return [2 /*return*/, userSession];
                }
            });
        });
    };
    UserSessionService.prototype.createUserSession = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, userSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshToken = user.generateRefreshToken();
                        userSession = this.userSessionRepository.create({
                            user: user,
                            refreshToken: refreshToken,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        });
                        return [4 /*yield*/, this.userSessionRepository.save(userSession)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, refreshToken];
                }
            });
        });
    };
    UserSessionService.prototype.deleteUserSession = function (userSession) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userSessionRepository.remove(userSession)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserSessionService;
}());
exports.default = UserSessionService;
//# sourceMappingURL=userSessionService.js.map