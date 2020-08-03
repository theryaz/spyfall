import * as express from 'express';
import { asyncWrap } from '../shared/async-wrap';
import { sanitizeBody, loadClientId } from '../middleware';
import { NotFoundError, BadRequestError } from '../errors';
import { GameService } from '../model/GameService';

export class GameRouter{
	public router: express.Router;
	constructor(private gameService: GameService){
		this.router = express.Router();
		this.middleware();
		this.routes();
	}
	private middleware(){}
	private routes(){
		this.router.route("/list")
			.get(asyncWrap(async (req, res) => {
				res.json({games: this.gameService.gameList});
			}));
		this.router.route("/create")
			.post(sanitizeBody, loadClientId,
			asyncWrap(async (req, res) => {
				const { clientId } = res.locals;
				const { userIdentity: host } = req.body;
				const { game, player } = this.gameService.createGame({ host, clientId });
				res.json({ gameState: game.state, player });
			}));
		this.router.route("/join/:gameId")
			.post(sanitizeBody, loadClientId,
				asyncWrap(async (req, res) => {
					const { clientId } = res.locals;
					const { gameId } = req.params;
					const { userIdentity, playerId } = req.body;
					const { gameState, player } = await this.gameService.joinGame({ userIdentity, clientId, gameId, playerId });
					res.json({ gameState, player });
				}));
		this.router.route("/reset/:gameId")
			.post(sanitizeBody,
				asyncWrap(async (req, res) => {
					const { gameId } = req.params;
					await this.gameService.resetGame({ gameId });
					res.status(200).end();
				}));
		this.router.route("/exit/:gameId")
			.post(sanitizeBody,
				asyncWrap(async (req, res) => {
					const { gameId } = req.params;
					const { playerId } = req.body;
					await this.gameService.exitGame({ gameId, playerId });
					res.status(200).end();
				}));
		this.router.route("/state/:gameId")
			.get(
			asyncWrap(async (req, res) => {
				const { gameId } = req.params;
				const game = this.gameService.findById(gameId);
				res.json({ gameState: game.state });
			}));
		this.router.route("/start/:gameId")
			.post(sanitizeBody,
			asyncWrap(async (req, res) => {
				const { gameId } = req.params;
				this.gameService.startGame(gameId);
				res.status(200).end();
			}));
	}
}
