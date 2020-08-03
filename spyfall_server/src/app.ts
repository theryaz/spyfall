import express from 'express';
import http from 'http';
import body_parser from 'body-parser';
import cors from 'cors';
import socket from 'socket.io';
import redisAdapter from 'socket.io-redis';

// import graphqlHTTP from 'express-graphql';
// import { graphqlSchema } from './schema';

import { createLogger } from './shared';
const logger = createLogger('app.ts');

let version: string;
try{
	version = require('../package.json').version;
}catch(e){
	console.error("Failed to load Version from package.json", e);
}

import { logRoute } from './middleware';
import { errorHandler } from './errors';

import { GameRouter } from './routes/game.router';
import { SocketIOController } from './model/socket.io.controller';
import { CONFIG } from './constants/config';
import { GameService } from './model/GameService';
import { Game } from './model/classes/Game';

export class App{

	public app: express.Application;
	public httpServer;
	public io: SocketIO.Server;
	public socketIOController: SocketIOController;
	public gameService: GameService;
	public gameRouter: GameRouter;
	constructor(){
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.io = socket(this.httpServer);
		// this.io.adapter(redisAdapter({ host: CONFIG.REDIS.HOST, post: CONFIG.REDIS.PORT }));
		this.socketIOController = new SocketIOController(this.io);
		this.gameService = new GameService(this.socketIOController);
		this.gameRouter = new GameRouter(this.gameService);
		this.socketHandlers();
		this.middleware();
		this.routes();
		this.postMiddleware();
	}

	private middleware(): void{
		logger.debug("App loading middleware");
		this.app.use(body_parser.json());
		this.app.use(cors());
		this.app.use(logRoute);
	}

	private routes(): void{
		logger.debug("App loading routes");
		this.app.get('/healthcheck', (_, res: express.Response) => res.status(200).end());
		this.app.get('/v1', (_, res: express.Response) => {
			res.json({
				result:"vEden Spyfall Api",
				version: version
			});
		});
		this.app.use("/v1/game", this.gameRouter.router);
	}
	private postMiddleware(): void{
		this.app.use(errorHandler);
	}

	private socketHandlers(): void{
		this.socketIOController.initializeSocketIOHandlers();
	}
}
const AppServer = new App();
export const socketIOController = AppServer.socketIOController;
export default AppServer.httpServer;
