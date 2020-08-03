"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 403;
        this.statusMessage = "Forbidden";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ForbiddenError = ForbiddenError;
;
