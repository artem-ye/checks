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
	// firstMoveTorn: COLOR;
}

const initialState: GameState = {
	isNewGameRequested: false,
	players: {
		[COLOR.BLACK]: createPlayer('Black player'),
		[COLOR.WHITE]: createPlayer('White player'),
	},
	// firstMoveTorn: COLOR.WHITE,
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setNewGameRequest: (state) => {
			state.isNewGameRequested = true;
		},
		clearNewGameRequest: (state) => {
			state.isNewGameRequested = false;
		},
		resetGame: (state, action: PayloadAction<{ whitePlayerName: string; blackPlayerName: string }>) => {
			const { whitePlayerName, blackPlayerName } = action.payload;
			state.players = {
				[COLOR.BLACK]: createPlayer(blackPlayerName),
				[COLOR.WHITE]: createPlayer(whitePlayerName),
			};
			// state.firstMoveTorn = COLOR.WHITE;
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

export const resetGame = (data: { whitePlayerName: string; blackPlayerName: string }) => (dispatch: AppDispatch) => {
	dispatch(gameActions.clearNewGameRequest());

	const { whitePlayerName, blackPlayerName } = data;
	dispatch(gameActions.resetGame({ whitePlayerName, blackPlayerName }));
};

export const selectIsNewGameRequested = (state: RootState) => state.game.isNewGameRequested;
export const selectPlayerInfo = (color: COLOR) => (state: RootState) => state.game.players[color];

export default gameSlice.reducer;
