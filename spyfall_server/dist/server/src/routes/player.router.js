"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO Use real Datastore
const socket_io_controller_1 = require("../model/socket.io.controller");
const express = __importStar(require("express"));
const middleware_1 = require("../middleware");
const async_wrap_1 = require("../shared/async-wrap");
class PlayerRouter {
    constructor() {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    middleware() { }
    routes() {
        this.router.route("/list")
            .get(middleware_1.sanitizeBody, async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const players = [];
            const connectedIds = Object.keys(socket_io_controller_1.connectedPlayers);
            for (const connectedId of connectedIds) {
                const player = socket_io_controller_1.connectedPlayers[connectedId];
                const game = socket_io_controller_1.gameList.find(g => g.hasPlayer(player));
                if (game !== undefined) {
                    // Don't show players playing games, or ended games with one player left
                    if (game.Players.length > 1 || game.GameOver)
                        continue;
                    player.gameShortId = game.ShortId;
                }
                players.push(player);
            }
            res.json({ players });
        })));
    }
}
exports.PlayerRouter = PlayerRouter;
exports.default = new PlayerRouter();
