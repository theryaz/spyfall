"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const shared_1 = require("./shared");
const logger = shared_1.createLogger('app.ts');
let version;
try {
    version = require('../package.json').version;
}
catch (e) {
    console.error("Failed to load Version from package.json", e);
}
const middleware_1 = require("./middleware");
const errors_1 = require("./errors");
const user_router_1 = __importDefault(require("./routes/user.router"));
const game_router_1 = __importDefault(require("./routes/game.router"));
const player_router_1 = __importDefault(require("./routes/player.router"));
const socket_io_controller_1 = require("./model/socket.io.controller");
class App {
    constructor() {
        this.app = express_1.default();
        this.httpServer = http_1.default.createServer(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.socketIOController = new socket_io_controller_1.SocketIOController(this.io);
        this.socketHandlers();
        this.middleware();
        this.routes();
        this.postMiddleware();
    }
    middleware() {
        logger.debug("App loading middleware");
        this.app.use(body_parser_1.default.json());
        this.app.use(cors_1.default());
        this.app.use(middleware_1.logRoute);
    }
    routes() {
        logger.debug("App loading routes");
        this.app.get('/healthcheck', (_, res) => res.status(200).end());
        this.app.get('/v1', (_, res) => {
            res.json({
                result: "Threes With Friends API",
                version: version
            });
        });
        this.app.use("/v1/user", user_router_1.default.router);
        this.app.use("/v1/player", player_router_1.default.router);
        this.app.use("/v1/game", game_router_1.default.router);
        // this.app.use('/graphql',
        // 		graphqlHTTP({
        // 			schema: graphqlSchema,
        // 			graphiql: true,
        // 		})
        // );
    }
    postMiddleware() {
        this.app.use(errors_1.errorHandler);
    }
    socketHandlers() {
        this.socketIOController.initializeSocketIOHandlers();
    }
}
exports.App = App;
const AppServer = new App();
exports.socketIOController = AppServer.socketIOController;
exports.default = AppServer.httpServer;
