"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var authRoutes_1 = __importDefault(require("../routes/authRoutes"));
var errorHandler_1 = __importDefault(require("../handlers/errorHandler"));
var notFoundHandler_1 = __importDefault(require("../handlers/notFoundHandler"));
var routes_1 = require("../constants/routes");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10000
}));
app.use(routes_1.AUTH_ROUTE, authRoutes_1.default);
app.use(errorHandler_1.default);
app.use(notFoundHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map