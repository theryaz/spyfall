"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 404;
        this.statusMessage = "Not found";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.NotFoundError = NotFoundError;
;
