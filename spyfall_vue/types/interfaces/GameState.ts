import { Player } from './Player';
import { GameStatus } from '../enums';

export interface GameState{
	id: string;
	status: GameStatus;
	timerSeconds: number;
	hostId: string;
	firstQuestionId: string;
	players: Player[];
	location: string;
	locations: string[];
}