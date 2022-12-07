import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLOR } from '../../models/colors';
import { AppDispatch, RootState } from '../store';
import { createPlayer } from './helpers';

export interface IPlayer {
	name: string;
	wins: number;
	draws: number;
	defeats: number;
}

interface GameState {
	isNewGameRequested: boolean;
	players: {
		[COLOR.BLACK]: IPlayer;
		[COLOR.WHITE]: IPlayer;
	};
	isPaused: boolean;
	isStarted: boolean;
}

const initialState: GameState = {
	isNewGameRequested: false,
	players: {
		[COLOR.BLACK]: createPlayer('Black player'),
		[COLOR.WHITE]: createPlayer('White player'),
	},
	isPaused: true,
	isStarted: false,
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setNewGameRequest: (state) => {
			state.isNewGameRequested = true;
			state.isPaused = true;
		},
		clearNewGameRequest: (state) => {
			state.isNewGameRequested = false;
			state.isPaused = false;
		},
		startNewGame: (state, action: PayloadAction<{ whitePlayerName: string; blackPlayerName: string }>) => {
			const { whitePlayerName, blackPlayerName } = action.payload;
			state.players = {
				[COLOR.BLACK]: createPlayer(blackPlayerName),
				[COLOR.WHITE]: createPlayer(whitePlayerName),
			};
			state.isStarted = true;
			state.isPaused = false;
			state.isNewGameRequested = false;
		},
	},
});

const { actions: gameActions } = gameSlice;

export const showNewGameRequest = () => (dispatch: AppDispatch) => {
	dispatch(gameActions.setNewGameRequest());
};

export const hideNewGameRequest = () => (dispatch: AppDispatch) => {
	dispatch(gameActions.clearNewGameRequest());
};

export const startNewGame = (data: { whitePlayerName: string; blackPlayerName: string }) => (dispatch: AppDispatch) => {
	const { whitePlayerName, blackPlayerName } = data;
	dispatch(gameActions.startNewGame({ whitePlayerName, blackPlayerName }));
};

export const selectIsNewGameRequested = (state: RootState) => state.game.isNewGameRequested;
export const selectPlayerInfo = (color: COLOR) => (state: RootState) => state.game.players[color];
export const selectIsGamePlaying = (state: RootState) => state.game.isStarted && !state.game.isPaused;

export default gameSlice.reducer;
