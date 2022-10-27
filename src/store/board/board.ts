import { AppDispatch, RootState } from './../store';
import { ISquares, ISquareCoordinates } from './../../models/types';
// import { ISquare } from '../../models/types';
import { createSlice } from '@reduxjs/toolkit';
import * as helpers from './helpers';

import type { PayloadAction } from '@reduxjs/toolkit';
import { COLOR } from '../../models/colors';

interface BoardState {
	squares: ISquares;
	activeSquare: ISquareCoordinates | null;
	activePlayer: COLOR;
	isMoveIncomplete: boolean;
	isGameOver: boolean;
	firstMoveTorn: COLOR;
}

const initialState: BoardState = {
	squares: helpers.createSquares(),
	activeSquare: null,
	activePlayer: COLOR.WHITE,
	isMoveIncomplete: false,
	isGameOver: false,
	firstMoveTorn: COLOR.WHITE,
};

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setPieces: (state) => {
			helpers.setPieces(state.squares);
		},
		transformPiece: (state, action: PayloadAction<ISquareCoordinates>) => {
			const { x, y } = action.payload;
			state.activeSquare = { x, y };
			helpers.transformPiece(state.squares, { x, y });
		},
		setActiveSquare: (state, action: PayloadAction<ISquareCoordinates | null>) => {
			if (!action.payload) {
				state.activeSquare = null;
				return;
			}

			const { x, y } = action.payload;
			state.activeSquare = { x, y };
		},
		highlightMoves: (state, action: PayloadAction<ISquareCoordinates>) => {
			const { x, y } = action.payload;
			helpers.highlightMoves(state.squares, { x, y });
		},
		clearHighlight: (state) => {
			helpers.clearMovesHighlighting(state.squares);
		},
		move(state, action: PayloadAction<{ source: ISquareCoordinates; target: ISquareCoordinates }>) {
			const src = action.payload.source;
			const dst = action.payload.target;
			const squares = state.squares;

			const piece = squares[src.y][src.x].piece;
			if (!piece) {
				return;
			}

			squares[dst.y][dst.x].piece = piece;
			squares[src.y][src.x].piece = null;
		},
		capture: (state, action: PayloadAction<ISquareCoordinates>) => {
			const { x, y } = action.payload;
			const squares = state.squares;
			squares[y][x].piece = null;
		},
		passTurn: (state, action: PayloadAction<{ isMoveIncomplete: boolean }>) => {
			if (action.payload.isMoveIncomplete) {
				// recursive captures not completed
				state.isMoveIncomplete = true;
				return;
			}

			state.isMoveIncomplete = false;
			state.activePlayer = state.activePlayer === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
		},
		newMatch: (state) => {
			helpers.setPieces(state.squares);
			state.activePlayer = state.firstMoveTorn;
			state.firstMoveTorn = state.firstMoveTorn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
		},
		resetBoard: (state) => {
			helpers.setPieces(state.squares);
			state.firstMoveTorn = COLOR.WHITE;
			state.activePlayer = COLOR.WHITE;
		},
	},
});

///////////////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////////////

const { actions } = boardSlice;

export const selectSquare = (square: ISquareCoordinates) => (dispatch: AppDispatch, getState: () => RootState) => {
	const { x, y } = square;

	const boardState = getState().board;
	const target = boardState.squares[y][x];

	if (!target.piece) {
		return;
	}

	if (boardState.isMoveIncomplete || target.piece.color !== boardState.activePlayer) {
		return;
	}

	dispatch(actions.setActiveSquare(target));
	dispatch(actions.highlightMoves(target));
};

export const move =
	(source: ISquareCoordinates | null, target: ISquareCoordinates) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		if (!source || !target) {
			return;
		}

		const getSquares = () => getState().board.squares;

		// if (getSquares()[target.y][target.x].piece?.color !== getState().board.activePlayer) {
		// 	return;
		// }

		const { canMove, captures: captureTarget } = helpers.canMove(getSquares(), source, target);
		if (!canMove) {
			return;
		}

		dispatch(actions.move({ source, target }));
		const isTransformationFieldReached = helpers.isTransformationFieldReached(getSquares(), target);
		isTransformationFieldReached && dispatch(actions.transformPiece(target));
		!!captureTarget && dispatch(actions.capture(captureTarget));

		// Move completed, if no more recursive captures available
		let isMoveIncomplete =
			(!!captureTarget || isTransformationFieldReached) && helpers.isCapturesAvailable(getSquares(), target);

		// Highlighting
		dispatch(actions.clearHighlight());
		if (isMoveIncomplete) {
			dispatch(actions.setActiveSquare(target));
			dispatch(actions.highlightMoves(target));
		} else {
			dispatch(actions.setActiveSquare(null));
		}

		// Is game over?
		if (!isMoveIncomplete && helpers.isWinningMove(getSquares(), target)) {
			alert('Victory ' + getState().board.activePlayer + { ...target });
		}

		dispatch(actions.passTurn({ isMoveIncomplete }));
	};

export const { setPieces, resetBoard, newMatch } = boardSlice.actions;

export const selectActivePlayer = (state: RootState) => state.board.activePlayer;
export const selectIsMoveIncomplete = (state: RootState) => state.board.isMoveIncomplete;
export const selectSquares = (state: RootState) => state.board.squares;

export const selectActiveSquare = (state: RootState) => {
	if (!state.board.activeSquare) {
		return;
	}

	const { x, y } = state.board.activeSquare;
	return state.board.squares[y][x];
};

export default boardSlice.reducer;
