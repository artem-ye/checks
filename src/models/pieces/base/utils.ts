import { getPieceModel } from '../utils';
import { PieceMoveModel } from './pieceMoveModel';

export function isTeammatesCaptureAvailable(moveModel: PieceMoveModel): boolean {
	return !!moveModel.getFriendlyPiecesSquares().find((square) => {
		if (!square.piece) {
			return false;
		}

		const pieceModel = getPieceModel(square.piece, moveModel.squares, square);
		return pieceModel.isCapturesAvailable();
	});
}
