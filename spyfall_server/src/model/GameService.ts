import { Game } from "./classes/Game";
import { UserIdentity, Player, GameState } from "../../../spyfall_vue/types/interfaces";
import { NotFoundError } from "../errors";
import { SocketIOController } from "./socket.io.controller";
import { randomAlphaString, randomString } from "../shared";

export class GameService{
	constructor(private io: SocketIOController){}
	gameList: Game[] = [];

	uniqueGameId(): string{
		const id = randomAlphaString(4).toUpperCase();
		const game = this.findGame(id);
		if(game === undefined) return id;
		return this.uniqueGameId();
	}
	uniquePlayerId(): string{
		return randomString(32);
	}

	findById(id: string): Game{
		const game = this.findGame(id.toUpperCase());
		if (game === undefined) throw new NotFoundError();
		return game;
	}

	findGame(id: string): Game | undefined{
		return this.gameList.find(g => g.Id === id);
	}

	createGame({ host, state, clientId }: { host: UserIdentity, state?: GameState, clientId: string }){
		const game = new Game(this.io, { id: this.uniqueGameId(), host, state, clientId });
		const player = game.getHost();
		this.gameList.push(game);
		return { game, player };
	}

	async joinGame({ userIdentity, gameId, clientId, playerId }: { userIdentity: UserIdentity, gameId: string, clientId: string; playerId?: string }): Promise<{ gameState: GameState; player: Player}>{
		const game = this.findById(gameId);
		const player = game.addPlayer(userIdentity, clientId, playerId);
		return { gameState: game.state, player };
	}

	async exitGame({ gameId, playerId }: { gameId: string; playerId: string }): Promise<void>{
		const game = this.findById(gameId);
		const player = game.findPlayerById(playerId);
		if(player === undefined) throw new NotFoundError();
		game.removePlayer(player);
	}

	startGame(gameId: string){
		const game = this.findById(gameId);
		game.start();
	}

}