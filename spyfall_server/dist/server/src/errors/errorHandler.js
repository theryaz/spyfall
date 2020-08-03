"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const { NODE_ENV } = shared_1.loadEnvs(['NODE_ENV'], false);
function errorHandler(error, _, res, next) {
    if (error) {
        let message = NODE_ENV === 'production' ? error.statusMessage : (error.message || error.statusMessage);
        shared_1.logger.error(`Error handled [${error.status}]: ${message}`);
        console.error(error);
        res.status(error.status || 500).json({
            result: {
                message: message,
                payload: error.payload
            }
        });
        return;
    }
    next();
}
exports.errorHandler = errorHandler;
;
