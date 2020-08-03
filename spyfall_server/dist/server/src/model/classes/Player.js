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
const constants_1 = require("../constants");
const db_1 = require("../db");
const shared_1 = require("../../shared");
const UserMutationTypes = __importStar(require("../../../../client-ts/src/store/user/user.types"));
const logger = shared_1.createLogger("Player.ts");
/**
 * Players are anyone currently connected via SocketIO from the site.
 * They can be registered or not.
 */
class Player {
    constructor(socket) {
        this.socket = socket;
        this.isInGame = false;
        this.isReady = true;
        socket.on('jwt', (jwt) => {
            logger.debug("Loaded Player JWT");
            this.onJwt(jwt).catch(e => {
                logger.error("JWT is invalid");
            });
        });
        socket.on(UserMutationTypes.JOIN_GAME, (payload) => this.onJoinGame(payload));
        socket.on(UserMutationTypes.SET_USER_INFO, (payload) => this.onSetUserInfo(payload));
    }
    get Uuid() { return this.uuid; }
    get Email() { return this.email; }
    get Username() { return this.username; }
    get Role() { return this.role; }
    get Id() { return this._id; }
    get User() {
        if (this.user !== null && this._id) {
            return db_1.UserModel.findOne({ _id: this._id });
        }
        else {
            return this.user;
        }
    }
    get PlayerInfo() {
        logger.silly(`PlayerInfo: ${this.username}`);
        return {
            avatarIcon: this.avatarIcon,
            avatarUrl: this.avatarUrl,
            color: this.color,
            username: this.username,
        };
    }
    get socketId() { return this.socket.client.id; }
    get isDisconnected() { return this.socket.disconnected; }
    get IsReady() { return this.isReady; }
    // Called when the player updates their JWT.
    onJwt(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield shared_1.verifyJwt(jwt);
            logger.debug("Player connected", decoded.data);
            this.email = decoded.data.email;
            this.username = decoded.data.username;
            this.role = decoded.data.role;
            this._id = decoded.data._id;
            this.user = yield db_1.UserModel.findOne({ _id: decoded.data._id });
        });
    }
    // Called when the player updates their JWT.
    onSetUsername(username) {
        this.username = username;
    }
    setRandomAvatar() {
        if (!this.user) {
            this.user = new db_1.UserModel();
        }
        this.user.avatarIcon = constants_1.Avatars.randomIcon();
        this.user.color = constants_1.Avatars.randomColor();
    }
    onJoinGame(payload) {
        logger.debug("onJoinGame", payload);
    }
    onSetUserInfo(payload) {
        logger.debug("onSetUserInfo", payload);
        this.username = payload.username;
        this.color = payload.color;
        this.avatarIcon = payload.avatarIcon;
        this.avatarUrl = payload.avatarUrl;
    }
    // Prevent Circular structure error
    toJSON() {
        return Object.assign({}, this, { socket: this.socketId, user: this.user ? this.user.getPublicFields() : this.PlayerInfo });
    }
}
exports.Player = Player;
