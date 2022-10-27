import { PieceMoveModel } from './../../models/pieces/base/pieceMoveModel';
import { PawnPieceModel } from '../../models/pieces/pawnPieceModel';
import { getPieceModel } from '../../models/pieces/utils';
import { COLOR } from './../../models/colors';
import { ISquare, ISquareCoordinates, ISquares } from './../../models/types';
import { PieceTypes } from '../../models/pieceTypes';

export function createSquares(): ISquares {
	const squares = [];

	for (let y = 0; y < 8; y++) {
		squares.push([] as ISquare[]);

		for (let x = 0; x < 8; x++) {
			const square = {
				id: Math.random(),
				color: getSquareColor(x, y),
				piece: null,
				x,
				y,
				isHighlighted: false,
			} as ISquare;

			squares[y].push(square);
		}
	}

	return squares;
}

export function setPieces(squares: ISquares): void {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (squares[y][x].piece) {
				squares[y][x].piece = null;
			}
		}
	}

	const WHITE_PEACE_PROPS = {
		color: COLOR.WHITE,
	};

	const BLACK_PEACE_PROPS = {
		color: COLOR.BLACK,
	};

	for (let i = 1; i < 8; i += 2) {
		squares[0][i].piece = PawnPieceModel.createObject(WHITE_PEACE_PROPS);
		squares[1][i - 1].piece = PawnPieceModel.createObject(WHITE_PEACE_PROPS);
		squares[2][i].piece = PawnPieceModel.createObject(WHITE_PEACE_PROPS);

		squares[5][i - 1].piece = PawnPieceModel.createObject(BLACK_PEACE_PROPS);
		squares[6][i].piece = PawnPieceModel.createObject(BLACK_PEACE_PROPS);
		squares[7][i - 1].piece = PawnPieceModel.createObject(BLACK_PEACE_PROPS);
	}
}

export function clearMovesHighlighting(squares: ISquares) {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (squares[y][x].isHighlighted) {
				squares[y][x].isHighlighted = false;
			}
		}
	}
}

export function highlightMoves(squares: ISquares, activeSquare: ISquareCoordinates) {
	clearMovesHighlighting(squares);

	if (!activeSquare) {
		return;
	}

	const { x, y } = activeSquare;

	if (x === null || y === null) {
		return;
	}

	const piece = squares[y][x].piece;

	if (!piece) {
		return;
	}

	const pieceModel = getPieceModel(piece, squares, activeSquare);
	pieceModel.highlightMoves();
}

type TCanMoveRetVal = {
	canMove: boolean;
	captures: ISquareCoordinates | undefined;
};
export function canMove(squares: ISquares, source: ISquareCoordinates, target: ISquareCoordinates): TCanMoveRetVal {
	const retVal: TCanMoveRetVal = {
		canMove: false,
		captures: undefined,
	};

	if (!source || !target) {
		return retVal;
	}

	const piece = squares[source.y][source.x].piece;

	if (!piece) {
		return retVal;
	}

	const pieceModel = getPieceModel(piece, squares, source);

	if (pieceModel.canMove(target)) {
		retVal.canMove = true;
		retVal.captures = pieceModel.getMoveCaptures(source, target);
	}

	return retVal;
}

export function isCapturesAvailable(squares: ISquares, target: ISquareCoordinates): boolean {
	const piece = squares[target.y][target.x].piece;

	if (!piece) {
		return false;
	}

	const pieceModel = getPieceModel(piece, squares, target);
	return pieceModel.isCapturesAvailable();
}

export function transformPiece(squares: ISquares, target: ISquareCoordinates) {
	const targetPiece = squares[target.y][target.x].piece;

	if (!targetPiece) {
		return;
	}

	if (targetPiece.type === PieceTypes.queen) {
		return;
	}

	targetPiece.type = PieceTypes.queen;
}

export function isTransformationFieldReached(squares: ISquares, target: ISquareCoordinates): boolean {
	const piece = squares[target.y][target.x].piece;

	return !!piece && PieceMoveModel.isTransformationFieldReached(piece, target);
}

export function isWinningMove(squares: ISquares, target: ISquareCoordinates): boolean {
	const color = squares[target.y][target.x].piece?.color;

	if (!color) {
		return false;
	}

	const OPPONENTS_COLOR = color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;

	const opponentsMovesAvailable = !!squares
		.reduce((acc, row) => {
			const squares: ISquare[] = row.filter((square) => square.piece?.color === OPPONENTS_COLOR);

			if (squares.length === 0) {
				return acc;
			}

			return [...acc, ...squares];
		}, [])
		.find((square) => {
			if (!square.piece) {
				return false;
			}

			return !getPieceModel(square.piece, squares, square).isBlocked();
		});

	return !opponentsMovesAvailable;
}

const getSquareColor = (x: number, y: number) => {
	return (x + y) % 2 === 0 ? COLOR.WHITE : COLOR.BLACK;
};
