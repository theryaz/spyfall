/* eslint-disable @typescript-eslint/no-empty-function */
import store from '../store/store';
import { sleep } from '@/helpers';
import router from '@/router';
import { LocalStorageKeys, SocketEvents } from '@/config/constants';
import localforage from 'localforage';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { GameState, Player, UserIdentity } from '../../types/interfaces';
import { GameStatus } from '../../types/enums';
import api from '../services/backend.service'

const Mutations = {
	SET_PLAYER_ID: 'SET_PLAYER_ID',
	UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
	RESET_GAME_STATE: 'RESET_GAME_STATE',
	CREATE_GAME: 'CREATE_GAME',
	CREATE_GAME_SUCCESS: 'CREATE_GAME_SUCCESS',
	CREATE_GAME_FAILURE: 'CREATE_GAME_FAILURE',
	START_GAME: 'START_GAME',
	START_GAME_SUCCESS: 'START_GAME_SUCCESS',
	START_GAME_FAILURE: 'START_GAME_FAILURE',
	JOIN_GAME: 'JOIN_GAME',
	JOIN_GAME_SUCCESS: 'JOIN_GAME_SUCCESS',
	JOIN_GAME_FAILURE: 'JOIN_GAME_FAILURE',
}
const name = 'GameStore';

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
@Module({
	namespaced: true,
	dynamic: true,
	name,
	store: store
})
export default class GameModule extends VuexModule {

	playerId: string | null = null;
	gameState: GameState = getDefaultGameState();

	get UserIdentity(): UserIdentity{
		return this.context.rootState.UserStore.user;
	}

	get InGame(): boolean{
		return this.gameState.id !== undefined && this.gameState.id.length > 0;
	}
	
	get Player(): Player | undefined{
		return this.gameState.players.find(p => p.id === this.playerId);
	}

	@Action({ rawError: true })
	async socketConnected() {
		api.Socket.on(SocketEvents.GAME_START, ({ gameState }: { gameState: GameState }) => {
			console.log("SocketEvents.GAME_START", { gameState });
			this.updateGameState({ gameState });
		});
		api.Socket.on(SocketEvents.UPDATE_GAME_STATE, ({ gameState }: { gameState: GameState }) => {
			console.log("SocketEvents.UPDATE_GAME_STATE", { gameState });
			this.updateGameState({ gameState });
		});
		api.Socket.on(SocketEvents.JOIN_GAME_SUCCESS, ({ gameState }: { gameState: GameState}) => {
			console.log("SocketEvents.JOIN_GAME_SUCCESS", { gameState });
			this.updateGameState({ gameState });
		});
		api.Socket.on(SocketEvents.GAME_CLOSED, () => {
			console.log("SocketEvents.GAME_CLOSED");
			this.exitGame();
		});
	}

	@Action({ rawError: true })
	async saveGameState(gameState: GameState) {
		await localforage.setItem<string | null>(LocalStorageKeys.PlayerId, this.playerId);
		await localforage.setItem<GameState>(LocalStorageKeys.GameState, gameState);
	}
	@Action({ rawError: true })
	async loadGameState(): Promise<GameState | null> {
		console.log("Loading Game State");
		const playerId = await localforage.getItem<string|null>(LocalStorageKeys.PlayerId);
		if(playerId !== null){
			await this.setPlayerId({ playerId });
		}
		const gameState = await localforage.getItem<GameState>(LocalStorageKeys.GameState);
		if (gameState !== null) {
			console.log("Loaded Game State", { gameState });
			try {
				await this.resumeGame(gameState);
				if (this.playerId !== null) {
					this.joinGame({ gameId: gameState.id, playerId: this.playerId });
				}
			} catch (e) {
				console.error("Can't resume game", e);
				this.exitGame();
			}
		}else{
			console.log("No Game to resume");
			this.syncRouteToGameState();
		}
		return gameState;
	}
	@Action({ rawError: true })
	async resumeGame(gameState: GameState) {
		console.log("Resuming Game", { gameState });
		try{
			const existingGame = await api.loadGameById(gameState.id);
			this.updateGameState({ gameState: existingGame });
			this.syncRouteToGameState();
		}catch(e){
			console.error("Failed to Resume Game", { gameState });
			this.exitGame();
		}
	}

	@Action setPlayerId({ playerId }: { playerId: string }){
		this.context.commit(Mutations.SET_PLAYER_ID, { playerId });
	}
	@Mutation [Mutations.SET_PLAYER_ID]({playerId}: {playerId: string}){
		this.playerId = playerId;
	}

	createGameLoading = false;
	@Action({ rawError: true })
	async createGame(){
		this.context.commit(Mutations.CREATE_GAME);
		const { gameState, player } = await api.createGame({ userIdentity: this.UserIdentity });
		this.setPlayerId({playerId: player.id});
		this.updateGameState({gameState});
		this.context.commit(Mutations.CREATE_GAME_SUCCESS);
	}
	@Mutation [Mutations.CREATE_GAME](){
		this.createGameLoading = true;
	}
	@Mutation [Mutations.CREATE_GAME_SUCCESS](){
		this.createGameLoading = false;
	}
	@Mutation [Mutations.CREATE_GAME_FAILURE](){
		this.createGameLoading = false;
		this.gameState = getDefaultGameState();
	}

	startGameLoading = false;
	@Action({ rawError: true })
	async startGame() {
		this.context.commit(Mutations.START_GAME);
		// this.updateGameState({ gameState });
		this.context.commit(Mutations.START_GAME_SUCCESS);
	}
	@Mutation [Mutations.START_GAME]() {
		this.startGameLoading = true;
	}
	@Mutation [Mutations.START_GAME_SUCCESS]() {
		this.startGameLoading = false;
	}
	@Mutation [Mutations.START_GAME_FAILURE]() {
		this.startGameLoading = false;
	}

	joinGameLoading = false;
	@Action({ rawError: true })
	async joinGame({ gameId, playerId }: { gameId: string; playerId?: string }) {
		this.context.commit(Mutations.JOIN_GAME);
		const { gameState, player } = await api.joinGame({
			gameId,
			userIdentity: this.UserIdentity,
			playerId,
		});
		this.setPlayerId({ playerId: player.id });
		this.updateGameState({ gameState });
		this.context.commit(Mutations.JOIN_GAME_SUCCESS);
	}
	@Mutation [Mutations.JOIN_GAME]() {
		this.joinGameLoading = true;
	}
	@Mutation [Mutations.JOIN_GAME_SUCCESS]() {
		this.joinGameLoading = false;
	}
	@Mutation [Mutations.JOIN_GAME_FAILURE]() {
		this.joinGameLoading = false;
	}

	@Action({ rawError: true })
	async exitGame() {
		if (this.playerId && this.gameState.id){
			await api.exitGame({ gameId: this.gameState.id, playerId: this.playerId });
		}
		this.context.commit(Mutations.RESET_GAME_STATE);
		await localforage.removeItem(LocalStorageKeys.GameState);
		this.syncRouteToGameState();
	}
	@Mutation [Mutations.RESET_GAME_STATE]() {
		this.gameState = getDefaultGameState();
	}

	@Action({ rawError: true })
	async updateGameState({gameState}: { gameState: GameState }) {
		this.context.commit(Mutations.UPDATE_GAME_STATE, { gameState });
		this.saveGameState(gameState);
		this.syncRouteToGameState();
	}
	@Mutation [Mutations.UPDATE_GAME_STATE]({ gameState }: { gameState: GameState }) {
		this.gameState = gameState;
	}

	@Action syncRouteToGameState(){
		console.log("syncRouteToGameState", { InGame: this.InGame });
		if(this.InGame === false){
			router.push({
				name: 'Home',
			}).catch((_) => {});
		}else if (this.gameState.status === GameStatus.InProgress || this.gameState.status === GameStatus.GameOver) {
			router.push({
				name: 'GameInProgress',
			}).catch((_) => {});
		} else {
			router.push({
				name: 'GameLobby',
			}).catch((_) => {});
		}
	}
}
