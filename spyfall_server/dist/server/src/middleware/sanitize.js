"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
// Mitigate injection attacks by escaping special mongodb characters
function sanitizeBody(req, _, next) {
    // logger.silly('[sanitizeBody]: ', req.body);
    for (let k of Object.keys(req.body)) {
        req.body[k] = mongo_sanitize_1.default(req.body[k]);
    }
    next();
}
exports.sanitizeBody = sanitizeBody;
function sanitizeQuery(req, _, next) {
    // logger.silly('[sanitizeQuery]: ', req.query);
    for (let k of Object.keys(req.query)) {
        req.query[k] = mongo_sanitize_1.default(req.query[k]);
    }
    next();
}
exports.sanitizeQuery = sanitizeQuery;
function sanitizeParams(req, _, next) {
    // logger.silly('[sanitizeParams]: ', req.params);
    for (let k of Object.keys(req.params)) {
        req.params[k] = mongo_sanitize_1.default(req.params[k]);
    }
    next();
}
exports.sanitizeParams = sanitizeParams;
