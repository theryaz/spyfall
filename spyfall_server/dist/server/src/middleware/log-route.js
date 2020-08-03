"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
function logRoute(req, _, next) {
    shared_1.logger.info(`[${req.ip}] ${req.method} ${req.path}`);
    next();
}
exports.logRoute = logRoute;
