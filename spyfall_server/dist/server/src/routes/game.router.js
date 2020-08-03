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
const app_1 = require("../app");
const socket_io_controller_1 = require("../model/socket.io.controller");
const express = __importStar(require("express"));
const middleware_1 = require("../middleware");
const async_wrap_1 = require("../shared/async-wrap");
const errors_1 = require("../errors");
const Game_1 = require("../model/classes/Game");
const MultiplayerMutationTypes = __importStar(require("../../../client-ts/src/store/multiplayer/multiplayer.types"));
class GameRouter {
    constructor() {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    middleware() { }
    routes() {
        this.router.route("/list")
            .get(async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json({ games: socket_io_controller_1.gameList });
        })));
        this.router.route("/create")
            .post(middleware_1.sanitizeBody, middleware_1.loadClientId, async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const clientId = res.locals.clientId;
            if (!clientId)
                throw new errors_1.BadRequestError("Socket.io Connection Id is required (x-client-id header)");
            const hostPlayer = socket_io_controller_1.connectedPlayers[clientId];
            if (!hostPlayer)
                throw new errors_1.BadRequestError(`Socket Id "${clientId}" not found`);
            const game = new Game_1.Game(app_1.socketIOController.io, [hostPlayer]);
            socket_io_controller_1.gameList.push(game);
            app_1.socketIOController.io.emit(MultiplayerMutationTypes.GET_USERS);
            res.json({ gameShortId: game.ShortId });
        })));
        this.router.route("/join/:gameShortId")
            .post(middleware_1.sanitizeBody, middleware_1.loadClientId, async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const clientId = res.locals.clientId;
            if (!clientId)
                throw new errors_1.BadRequestError("Socket.io Connection Id is required (x-client-id header)");
            const player = socket_io_controller_1.connectedPlayers[clientId];
            const { gameShortId } = req.params;
            const game = socket_io_controller_1.gameList.find(g => g.ShortId === gameShortId.toUpperCase());
            if (!game)
                throw new errors_1.NotFoundError(`Game not found with Id ${gameShortId}`);
            game.addPlayer(player);
            res.json({ result: "ok" });
        })));
    }
}
exports.GameRouter = GameRouter;
exports.default = new GameRouter();
