"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function sha512(password, salt) {
    let hash = crypto_1.default.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}
exports.sha512 = sha512;
