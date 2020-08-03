import { createLogger, sleep } from '../shared';
const logger = createLogger("socket.io.controller.ts");
import { CONFIG } from '../constants/config';

export class SocketIOController{
	
	private clientCount: number = 0;
	public connectedClients: { [id: string]: SocketIO.Socket} = {};

	constructor(public io: SocketIO.Server){
		this.setupCleanupDeadConnections();
		// this.startDebugLogInterval();
	}
	private addClient(socket: SocketIO.Socket){
		this.connectedClients[socket.client.id] = socket;
		this.clientCount++;
		logger.debug(`${this.clientCount} clients connected`);
	}
	private removeClient(socketId: string){
		delete this.connectedClients[socketId];
		this.clientCount--;
		logger.debug(`${this.clientCount} clients connected`);
	}
	private setupCleanupDeadConnections(){
		setInterval(() => {
				this.cleanupDeadConnections();
		}, CONFIG.SOCKETS.EXPIRY_INTERVAL);
	}
	private cleanupDeadConnections(){
		// logger.debug("Cleanup Dead connections...");
		for(let socket of Object.values(this.connectedClients)){
			if(socket.connected !== true){
				logger.debug("Removed Dead connection: " + socket.client.id);
				this.removeClient(socket.client.id);
			}
		}
	}

	public initializeSocketIOHandlers(){
		logger.info("initializeSocketIOHandlers");
		this.io.on('connection', (socket) => {
			const clientLogger = createLogger(`Client ${socket.client.id}`);
			clientLogger.info("Connected");
			this.addClient(socket);
			socket.on('disconnect', () =>{
				clientLogger.info("Disconnected");
				this.removeClient(socket.client.id);
			});
		});
	}

};