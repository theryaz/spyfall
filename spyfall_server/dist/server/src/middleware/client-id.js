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
const errors_1 = require("../errors");
/**
*	Load SocketIO Client ID from header
*/
function loadClientId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.clientId = req.headers['x-client-id'];
        if (!res.locals.clientId)
            throw new errors_1.BadRequestError("Socket.io Connection Id is required (x-client-id header)");
        next();
    });
}
exports.loadClientId = loadClientId;
