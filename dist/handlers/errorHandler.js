"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statusCodes_1 = require("../constants/statusCodes");
var errorHandler = function (err, req, res, next) {
    // Determine if error has a message and statuscode, if not add default options.
    var customError = {
        statusCode: 'statusCode' in err ? err.statusCode : statusCodes_1.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong try again later',
    };
    // Return the error response.
    console.log(customError.message);
    return res.status(customError.statusCode).json({ message: customError.message });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map