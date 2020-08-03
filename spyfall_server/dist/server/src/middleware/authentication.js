"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const errors_1 = require("../errors");
/**
*	Load JWT from Authorization header to res.locals.jwtData
*/
function authentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.headers['authorization'])
            return next(new errors_1.UnauthorizedError("No credentials provided"));
        const auth = req.headers['authorization'];
        const [, token] = auth.split(' '); // Split 'Bearer' from base64 string
        try {
            const decodedToken = yield shared_1.verifyJwt(token);
            shared_1.logger.silly("Decoded Token:", { decodedToken });
            res.locals.jwtData = decodedToken.data;
            next();
        }
        catch (error) {
            shared_1.logger.error("JWT Error:", error);
            next(new errors_1.UnauthorizedError("Invalid Token"));
        }
    });
}
exports.authentication = authentication;
