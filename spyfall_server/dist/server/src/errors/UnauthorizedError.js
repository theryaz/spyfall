"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 401;
        this.statusMessage = "Unauthorized";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UnauthorizedError = UnauthorizedError;
