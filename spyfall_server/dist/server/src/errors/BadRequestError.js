"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequestError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 400;
        this.statusMessage = "Not found";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BadRequestError = BadRequestError;
;
