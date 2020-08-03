"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("./shared");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 4280;
shared_1.logger.debug("App Listening on port " + PORT);
app_1.default.listen(PORT);
