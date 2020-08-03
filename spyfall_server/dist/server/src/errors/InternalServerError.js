"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InternalServerError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 500;
        this.statusMessage = "Internal server error";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InternalServerError = InternalServerError;
;
