"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const shared_1 = require("../../shared");
const app_1 = require("../../app");
const GameMutationTypes = __importStar(require("../../../../client-ts/src/store/game/game.types"));
const MultiplayerMutationTypes = __importStar(require("../../../../client-ts/src/store/multiplayer/multiplayer.types"));
const GAME_OVER_COUNTDOWN_SECONDS = 30;
const START_CHECK_INTERVAL = 1 * 1000;
class Game {
    constructor(io, initialPlayers) {
        this.io = io;
        this.gameOverCountdown = GAME_OVER_COUNTDOWN_SECONDS;
        this.gameOver = false;
        this.players = [];
        this.shortId = shared_1.randomString(6).toUpperCase();
        this.uuid = v4_1.default();
        this.logger = shared_1.createLogger(`Game.ts ${this.uuid}`);
        this.logger.debug("Game Created");
        initialPlayers.forEach((player) => {
            this.addPlayer(player);
        });
    }
    get RoomId() {
        return `Game/${this.uuid}`;
    }
    get ShortId() {
        return this.shortId;
    }
    get GameOver() {
        return this.gameOver;
    }
    get AllPlayersReady() {
        return this.players.reduce((isReady, b) => isReady && b.IsReady, true);
    }
    get Players() {
        return this.players;
    }
    hasPlayer(player) {
        return this.players.find(p => p.socketId === player.socketId);
    }
    addPlayer(player) {
        player.isInGame = true;
        this.players.push(player);
        this.logger.debug(`${player.Username} joined`);
        if (this.players.length === 2) {
            this.startGame();
        }
    }
    removePlayer(player) {
        player.isInGame = false;
        this.players.splice(this.players.findIndex(p => p.socketId === player.socketId), 1);
        if (this.players.length === 0) {
            this.logger.silly(`All players have left the game ${this.ShortId}`);
        }
    }
    startGameInterval() {
        return __awaiter(this, void 0, void 0, function* () {
            this.readyCheckInterval = setInterval(() => {
                this.startGame();
            }, START_CHECK_INTERVAL);
        });
    }
    clearGameInterval() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.readyCheckInterval)
                clearInterval(this.readyCheckInterval);
        });
    }
    startGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.players.length < 2) {
                this.logger.silly(`Not enough players to start game: ${this.players.map(p => p.Username)}`);
            }
            if (this.AllPlayersReady) {
                this.clearGameInterval();
                this.logger.info(`Starting Game! ${this.players.map(p => p.Username)}`);
                // this.addPlayersToGameRoom();
                this.sendPlayerInfo();
                this.emitStartGame();
                this.linkPlayerGames();
                this.listenForPlayerExit();
                this.listenForGameOver();
            }
        });
    }
    sendPlayerInfo() {
        console.log("sendPlayerInfo", this.players);
        this.players.forEach((player, index) => {
            this.players.forEach((otherPlayer, otherIndex) => {
                if (index === otherIndex)
                    return;
                otherPlayer.socket.emit(GameMutationTypes.SET_REMOTE_PLAYER_INFO, player.PlayerInfo);
            });
        });
    }
    emitStartGame() {
        this.players.forEach((player) => {
            const initialGridState = {
                cells: [
                    { c: 0, r: 0, value: 3 },
                    { c: 1, r: 0, value: 3 },
                    { c: 2, r: 0, value: 3 },
                    { c: 3, r: 0, value: 3 },
                    { c: 0, r: 1, value: 3 },
                    { c: 1, r: 1, value: 3 },
                    { c: 2, r: 1, value: 3 },
                    { c: 3, r: 1, value: 3 },
                    { c: 0, r: 2, value: 2 },
                    { c: 1, r: 2, value: 2 },
                    { c: 2, r: 2, value: 2 },
                    { c: 3, r: 2, value: 2 },
                    { c: 0, r: 3, value: 1 },
                    { c: 1, r: 3, value: 1 },
                    { c: 2, r: 3, value: 1 },
                    { c: 3, r: 3, value: 1 },
                ],
                nextNumber: 1
            };
            this.logger.silly("Emit GAME_START", this.players.map(p => p.PlayerInfo));
            player.socket.emit(GameMutationTypes.GAME_START, initialGridState);
        });
    }
    // TODO: This should use socket io namespaces or something instead of looping
    linkPlayerGames() {
        this.players.forEach((player, index) => {
            player.socket.on('onMove', (move) => {
                // this.logger.silly(`${player.Username}: ${move.direction}`);
                this.players.forEach((p, otherIndex) => {
                    if (index === otherIndex)
                        return;
                    // this.logger.silly(`Emit Move to ${p.Username}`);
                    p.socket.emit(GameMutationTypes.REMOTE_MOVE, move);
                });
            });
        });
    }
    listenForPlayerExit() {
        this.players.forEach((player) => {
            player.socket.on(GameMutationTypes.ON_EXIT_MULTIPLAYER, () => {
                this.logger.silly(`listenForPlayerExit: ${player.Username} exited`);
                this.players.filter(p => p.socketId !== player.socketId).forEach(p => p.socket.emit(GameMutationTypes.REMOTE_PLAYER_EXIT));
                this.removePlayer(player);
                this.gameOver = true;
                // TODO Don't push updates to the client like this
                app_1.socketIOController.io.emit(MultiplayerMutationTypes.GET_USERS);
            });
        });
    }
    listenForGameOver() {
        this.players.forEach((player) => {
            player.socket.on(GameMutationTypes.GAME_OVER, ({ score }) => {
                this.logger.silly(`listenForGameOver: ${player.Username} emitted game over`);
                this.players.filter(p => p.socketId !== player.socketId).forEach(p => p.socket.emit(GameMutationTypes.REMOTE_GAME_OVER, { score }));
                this.startGameOverCountDown();
            });
        });
    }
    startGameOverCountDown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gameOver === true) {
                this.gameOverCountdown = 0;
                return;
            }
            this.gameOver = true;
            this.logger.silly('startGameOverCountDown');
            this.gameOverCountdown = GAME_OVER_COUNTDOWN_SECONDS;
            this.emitGameOverCountdown();
            while (this.gameOverCountdown > 0) {
                yield shared_1.sleep(1000);
                this.gameOverCountdown--;
                this.logger.silly(`startGameOverCountDown ${this.gameOverCountdown}`);
                this.emitGameOverCountdown();
            }
            this.logger.silly(`startGameOverCountDown: Game Over!`);
        });
    }
    emitGameOverCountdown() {
        this.players.forEach(p => p.socket.emit(GameMutationTypes.GAME_OVER_COUNTDOWN, this.gameOverCountdown));
    }
}
exports.Game = Game;
