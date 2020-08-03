"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const shared_1 = require("../shared");
const constants_1 = require("../model/constants");
const { JWT_SECRET } = shared_1.loadEnvs(["JWT_SECRET"]);
function verifyJwt(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decodedToken) => {
            shared_1.logger.silly("Verified JWT decodedToken:", decodedToken);
            if (err || !decodedToken)
                reject(err);
            else
                resolve(decodedToken);
        });
    });
}
exports.verifyJwt = verifyJwt;
function createJwt({ data, maxAge }) {
    if (!maxAge)
        maxAge = constants_1.JWT_EXPIRY_SECONDS;
    return jsonwebtoken_1.default.sign({ data }, JWT_SECRET, {
        expiresIn: maxAge,
        algorithm: 'HS256'
    });
}
exports.createJwt = createJwt;
