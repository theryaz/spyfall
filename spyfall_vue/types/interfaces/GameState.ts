import { Location } from './Location';
import { Player } from './Player';
import { GameStatus } from '../enums';

export interface GameState{
	id: string;
	status: GameStatus;
	timerSeconds: number;
	currentTimer: number;
	hostId: string;
	firstQuestionId: string;
	players: Player[];
	location?: Location;
	locations: string[];
}