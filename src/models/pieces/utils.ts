import { BasePieceModel } from './base/pieceModel';
import { ISquares, ISquareCoordinates } from '../types';
import { PieceTypes } from '../pieceTypes';
import { PawnPieceModel } from './pawnPieceModel';
import { QueenPieceModel } from './queenPieceModel';
import { IPiece } from '../types';

export function getPieceModel(pieceObject: IPiece, squares: ISquares, position: ISquareCoordinates): BasePieceModel {
	let ModelClass;

	if (pieceObject.type === PieceTypes.pawn) {
		ModelClass = PawnPieceModel;
	} else if (pieceObject.type === PieceTypes.queen) {
		ModelClass = QueenPieceModel;
	} else {
		throw new Error('getPieceModel unknown piece type');
	}

	return new ModelClass(pieceObject, squares, position);
}
