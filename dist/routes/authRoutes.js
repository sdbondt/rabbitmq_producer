"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("../constants/routes");
var authController_1 = require("../controllers/authController");
var router = express_1.default.Router();
// Route for user registration.
router.post(routes_1.SIGNUP_ROUTE, authController_1.signup);
// Route for user authentication.
router.post(routes_1.LOGIN_ROUTE, authController_1.login);
// Route for refreshing access token.
router.post(routes_1.REFRESH_TOKEN_ROUTE, authController_1.refreshToken);
// Route for logging out => destroy refresh token and userSession.
router.post(routes_1.LOGOUT_ROUTE, authController_1.logout);
// Route for requesting a password reset.
router.post(routes_1.FORGOT_PASSWORD_ROUTE, authController_1.forgotPassword);
// Route for resetting the user password.
router.post(routes_1.RESET_PASSWORD_ROUTE, authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map