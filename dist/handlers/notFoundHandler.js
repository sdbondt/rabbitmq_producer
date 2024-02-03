"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NotFoundHandler: middleware for handling requests to undefined routes.
var notFoundHandler = function (req, res) { return res.status(404).json({ message: 'Route not found.' }); };
exports.default = notFoundHandler;
//# sourceMappingURL=notFoundHandler.js.map