"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
const mongoose_1 = __importDefault(require("mongoose"));
const shared_1 = require("../shared");
let MONGO_URL;
try {
    let envs = shared_1.loadEnvs(['MONGO_URL']);
    MONGO_URL = envs['MONGO_URL'];
}
catch (e) {
    MONGO_URL = 'mongodb://127.0.0.1:27107/veden';
}
shared_1.logger.info('Connecting to MongoDB: ' + MONGO_URL);
mongoose_1.default.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error:'));
db.once('open', function () {
    shared_1.logger.info("MongoDB Connection Open!");
});
var user_model_1 = require("./user.model");
exports.User = user_model_1.User;
exports.UserModel = user_model_1.UserModel;
var game_model_1 = require("./game.model");
exports.Game = game_model_1.Game;
exports.GameModel = game_model_1.GameModel;
