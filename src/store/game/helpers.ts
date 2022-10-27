import { IPlayer } from './game';

export function createPlayer(name: string): IPlayer {
	return {
		name,
		wins: 0,
		draws: 0,
		defeats: 0,
	};
}
