"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const logger = shared_1.createLogger("socket.io.controller.ts");
const constants_1 = require("../model/constants");
const MultiplayerMutationTypes = __importStar(require("../../../client-ts/src/store/multiplayer/multiplayer.types"));
const Player_1 = require("./classes/Player");
function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
}
exports.connectedPlayers = {};
exports.gameList = [];
class SocketIOController {
    constructor(io) {
        this.io = io;
        this.connectedClients = 0;
        this.connectedPlayers = exports.connectedPlayers;
        this.gameList = exports.gameList;
        this.setupCleanupDeadConnections();
        // this.startDebugLogInterval();
    }
    addClient(socket) {
        this.connectedPlayers[socket.client.id] = new Player_1.Player(socket);
        this.connectedClients++;
        this.io.emit(MultiplayerMutationTypes.ADD_USER, this.connectedPlayers[socket.client.id]);
        logger.debug(`${this.connectedClients} clients connected`);
    }
    removeClient(socketId) {
        delete this.connectedPlayers[socketId];
        this.connectedClients--;
        logger.debug(`${this.connectedClients} clients connected`);
    }
    setupCleanupDeadConnections() {
        setInterval(() => {
            this.cleanupDeadConnections();
        }, constants_1.CONFIG.SOCKETS.EXPIRY_INTERVAL);
    }
    cleanupDeadConnections() {
        // logger.debug("Cleanup Dead connections...");
        for (let player of Object.values(this.connectedPlayers)) {
            if (player.isDisconnected === true) {
                logger.debug("Removed Dead connection: " + player.socketId);
                this.removeClient(player.socketId);
            }
        }
    }
    startDebugLogInterval() {
        logger.debug("startDebugLogInterval");
        const logSocketState = () => {
            console.log(`Server has ${this.connectedClients} connections`);
            console.log(Object.keys(this.connectedPlayers).map(key => `${JSON.stringify(this.connectedPlayers[key].toJSON(), null, 2)}`).join('\n'));
        };
        logSocketState();
        setInterval(logSocketState, 8000);
    }
    initializeSocketIOHandlers() {
        logger.info("initializeSocketIOHandlers");
        this.io.on('connection', (socket) => {
            const clientLogger = shared_1.createLogger(`Client ${socket.client.id}`);
            clientLogger.info("Connected");
            this.addClient(socket);
            socket.on('disconnect', () => {
                clientLogger.info("Disconnected");
                this.removeClient(socket.client.id);
                this.io.emit(MultiplayerMutationTypes.GET_USERS);
            });
        });
    }
}
exports.SocketIOController = SocketIOController;
;
