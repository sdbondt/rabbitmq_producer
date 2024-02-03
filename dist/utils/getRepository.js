"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_source_1 = require("../data-source");
// HandleGetRepository: handler for returning the correct repository depending on the node environment.
var handleGetRepository = function (entity) {
    var environment = process.env.NODE_ENV || 'development';
    return environment === 'test' ? data_source_1.TestDataSource.manager.getRepository(entity) : data_source_1.AppDataSource.manager.getRepository(entity);
};
exports.default = handleGetRepository;
//# sourceMappingURL=getRepository.js.map