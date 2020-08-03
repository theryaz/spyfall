"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
const configEnvs = shared_1.loadEnvs([
    'SOCKET_EXPIRY_INTERVAL'
], false);
exports.CONFIG = {
    SOCKETS: {
        EXPIRY_INTERVAL: +configEnvs['SOCKET_EXPIRY_INTERVAL'] || (60 * 1000)
    },
};
