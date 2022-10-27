import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './board/board';
import gameReducer from './game/game';

export const store = configureStore({
	reducer: {
		board: boardReducer,
		game: gameReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
