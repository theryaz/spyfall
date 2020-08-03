"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TeapotError extends Error {
    constructor(message, payload) {
        super(message);
        this.status = 418;
        this.statusMessage = "I'm a teapot.";
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.TeapotError = TeapotError;
;
