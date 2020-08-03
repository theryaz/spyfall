import { GameState, UserIdentity, Player } from '../../../../spyfall_vue/types/interfaces';
import { GameStatus } from '../../../../spyfall_vue/types/enums';
import { SocketEvents } from '../../../../spyfall_vue/src/config/constants/socket';
import { randomString, randomElement, createLogger } from '../../shared';
import { Logger } from 'winston';
import { BadRequestError } from '../../errors';
import { SocketIOController } from '../socket.io.controller';
const logger = createLogger('');

const getDefaultGameState = (): GameState => ({
	id: '',
	status: GameStatus.WaitingToStart,
	timerSeconds: 0,
	players: [],
	hostId: "",
	firstQuestionId: "",
	location: "",
	locations: [],
})

export class Game{
	logger: Logger;
	state: GameState;
	constructor(private io: SocketIOController, { id, host, state = getDefaultGameState(), clientId }: { id: string, host: UserIdentity, state?: GameState, clientId: string }){
		this.state = state;
		this.state.id = id;
		this.logger = createLogger(`[Game ${this.Id}]`);
		this.setHost(host, clientId);
	}

	get Id(){
		return this.state.id;
	}

	start(){
		if (this.state.status === GameStatus.InProgress){
			throw new BadRequestError("Game is alreay in progress");
		}
		this.state.status = GameStatus.InProgress;
		this.state.firstQuestionId = randomElement<Player>(this.state.players).id;
		this.broadcastGameState();
	}

	assignRandomRoles(){
		
	}
	getRandomLocation(){
		
	}

	async broadcast(event: string, payload?: any){
		this.logger.info(`Broadcasting ${event} to ${this.state.players.length} players`);
		await Promise.all(this.state.players
			.filter(player => player.clientId !== undefined)
			.map(player => {
				return this.io.connectedClients[player.clientId!].emit(event, payload);
		}));
	}

	getHost(): Player | undefined{
		return this.state.players.find(p => p.id === this.state.hostId);
	}
	setHost(host: UserIdentity, clientId: string){
		this.logger.info('setHost', { host });
		const hostPlayer = this.addPlayer(host, clientId);
		this.state.hostId = hostPlayer.id;
		this.broadcastGameState();
	}

	addPlayer(playerIdentity: UserIdentity, clientId: string, playerId?: string){
		this.logger.info('addPlayer', { playerId, clientId, playerIdentity});
		let player: Player | undefined;
		if (playerId !== undefined){
			player = this.findPlayerById(playerId);
			if (player !== undefined){
				player.id = playerId;
				player.clientId = clientId;
				player.identity = playerIdentity;
				this.logger.info('addPlayer: Rejoined existing player', { player });
			}
		}
		if(player===undefined) {
			player = {
				id: randomString(8),
				identity: playerIdentity,
				role: "",
				clientId,
			};
			this.state.players.push(player);
			this.logger.info('addPlayer added new Player', { player });
		}
		this.listenForDisconnect(player);
		this.listenForIDChanges(player);
		this.broadcast(SocketEvents.JOIN_GAME_SUCCESS, { gameState: this.state });
		return player;
	}
	removePlayer(player: Player){
		const p = this.findPlayerById(player.id);
		if(p === undefined){
			logger.debug("removePlayer: couldn't find player", { player });
			return;
		}
		this.state.players.splice(this.state.players.indexOf(p), 1);
		this.broadcastGameState();
		if(this.state.players.length === 0 || this.state.hostId === p.id){
			this.broadcast(SocketEvents.GAME_CLOSED);
		}
	}

	listenForDisconnect(player: Player){
		if(player.clientId === undefined){
			logger.error("listenForDisconnect player doesn't have a clientId", { player });
			return;
		}
		const socket = this.io.connectedClients[player.clientId];
		socket.on(SocketEvents.DISCONNECTED, () => {
			this.onPlayerDisconnected(player);
		})
	}
	onPlayerDisconnected(player: Player){
		logger.info('Player Disconnected');
		player.clientId = undefined;
		this.broadcastGameState();
	}
	listenForIDChanges(player: Player){
		if(player.clientId === undefined){
			logger.error("listenForIDChanges player doesn't have a clientId", { player });
			return;
		}
		const socket = this.io.connectedClients[player.clientId];
		socket.on(SocketEvents.UPDATE_IDENTITY, ({ identity }: { identity: UserIdentity }) => {
			player.identity = identity;
			this.broadcastGameState();
		});
	}

	findPlayerById(playerId: string): Player | undefined{
		return this.state.players.find(p => p.id === playerId);
	}

	async broadcastGameState(){
		await this.broadcast(SocketEvents.UPDATE_GAME_STATE, { gameState: this.state });
	}

}