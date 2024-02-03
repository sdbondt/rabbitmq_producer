"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBITMQ_CONNECTION_ERROR = exports.RESET_TOKEN_INVALID_OR_EXPIRED = exports.AUTHENTICATION_REFRESH_TOKEN_MISSING = exports.AUTHENTICATION_REFRESH_TOKEN_INVALID = exports.AUTHENTICATION_INVALID = exports.AUTHENTICATION_REQUIRED = exports.AUTH_PASSWORD_MISSING = exports.AUTH_CREDENTIALS_INVALID = exports.AUTH_EMAIL_ALREADY_IN_USE = exports.AUTH_EMAIL_FORMAT = exports.AUTH_PASSWORDS_DONT_MATCH = exports.AUTH_PASSWORD_FORMAT = exports.AUTH_USERNAME_LENGTH = void 0;
exports.AUTH_USERNAME_LENGTH = 'Username must be minimum 2 and maximum 30 characters long.';
exports.AUTH_PASSWORD_FORMAT = 'Password must contain and uper and lower case character and be at least 6 characters long';
exports.AUTH_PASSWORDS_DONT_MATCH = 'The passwords don\'t match';
exports.AUTH_EMAIL_FORMAT = 'Must be a valid email.';
exports.AUTH_EMAIL_ALREADY_IN_USE = 'That email is already being used.';
exports.AUTH_CREDENTIALS_INVALID = 'Invalid credentials.';
exports.AUTH_PASSWORD_MISSING = 'You must provide a password to login.';
exports.AUTHENTICATION_REQUIRED = 'Authentication required.';
exports.AUTHENTICATION_INVALID = 'Authentication invalid.';
exports.AUTHENTICATION_REFRESH_TOKEN_INVALID = 'Refresh token is invalid.';
exports.AUTHENTICATION_REFRESH_TOKEN_MISSING = 'Refresh token is missing.';
exports.RESET_TOKEN_INVALID_OR_EXPIRED = 'Invalid request: reset token is invalid or has expired.';
exports.RABBITMQ_CONNECTION_ERROR = 'Someothing went wrong when connecting to rabbitmq.';
//# sourceMappingURL=errorMessages.js.map