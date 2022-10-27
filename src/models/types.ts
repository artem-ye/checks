import { PieceTypes } from './pieceTypes';
import { COLOR } from './colors';

export interface IPiece {
	color: COLOR;
	type: PieceTypes;
	id: number;
}

export interface ISquare {
	color: COLOR;
	piece: IPiece | null;
	x: number;
	y: number;
	isHighlighted: boolean;
	id: number;
}

export type ISquareCoordinates = {
	x: number;
	y: number;
};

export type ISquares = ISquare[][];
