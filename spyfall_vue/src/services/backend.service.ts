import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../config';
import { SocketEvents } from '../config/constants';
import io from 'socket.io-client';
import { GameState, UserIdentity, Player } from '@/../../types/interfaces';
import { gameStore } from '../store';

class BackendService{
	private api: AxiosInstance;
	private socket: SocketIOClient.Socket;
	constructor(private baseUrl: string = BASE_URL){
		this.socket = io.connect(BASE_URL);
		this.setupSocketIo();
		this.api = axios.create({
			baseURL: BASE_URL
		});
		console.log("[BackendService] Initializing");
	}

	get Socket(){
		return this.socket;
	}

	setupSocketIo(){
		this.socket.on(SocketEvents.CONNECTED, () => {
			console.log("Socket.io Connected!");
			gameStore.socketConnected();
		});
	}

	get(uri: string, headers = {}) {
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
		};
		return this.api.get(uri, { headers });
	}
	post(uri: string, payload: { [field: string]: any }, headers = {}) {
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
		};
		return this.api.post(uri, payload, { headers });
	}
	put(uri: string, payload: { [field: string]: any }, headers = {}) {
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
		};
		return this.api.put(uri, payload, { headers });
	}
	delete(uri: string, headers = {}) {
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
		};
		return this.api.delete(uri, { headers });
	}


	async loadGameById(id: string): Promise<GameState>{
		const res = await this.get(`/v1/game/state/${id}`);
		return res.data.gameState;
	}
	async createGame({ userIdentity }: { userIdentity: UserIdentity }): Promise<{gameState: GameState;  player: Player}>{
		const res = await this.post('/v1/game/create', { userIdentity });
		return {
			gameState: res.data.gameState,
			player: res.data.player,
		};
	}
	async startGame({ gameId }: { gameId: string }): Promise<{gameState: GameState}>{
		const res = await this.post(`/v1/game/start/${gameId}`, {});
		return {
			gameState: res.data.gameState,
		};
	}
	async joinGame({
		gameId,
		userIdentity,
		playerId
	}: { gameId: string; userIdentity: UserIdentity; playerId?: string }): Promise<{gameState: GameState;  player: Player}>{
		const res = await this.post(`/v1/game/join/${gameId}`, { userIdentity, playerId });
		return {
			gameState: res.data.gameState,
			player: res.data.player,
		};
	}
	async exitGame({
		gameId,
		playerId
	}: { gameId: string; playerId: string }): Promise<void>{
		await this.post(`/v1/game/exit/${gameId}`, { playerId });
	}
	async resetGame({
		gameId,
	}: { gameId: string }): Promise<void>{
		await this.post(`/v1/game/reset/${gameId}`, {});
	}

}

export default new BackendService();