import { ISquareCoordinates } from './../types';
import { PieceTypes } from '../pieceTypes';
import { BasePieceModel } from './base/pieceModel';
import { PieceMoveModel, TSquareCoordinates } from './base/pieceMoveModel';
import { isTeammatesCaptureAvailable } from './base/utils';

export class PawnPieceModel extends BasePieceModel {
	static type: PieceTypes = PieceTypes.pawn;

	isBlocked(): boolean {
		if (this.isCapturesAvailable()) {
			return false;
		}

		const canMove = PieceMoveModel.getDiagonals(this.squares, this.position)
			.map((diagonal) => diagonal[1])
			.find((square) => this.canMove(square));

		return !canMove;
	}

	canMove(target: ISquareCoordinates): boolean {
		if (!super.canMove(target) || !this.position) {
			return false;
		}

		const moveModel = this._createMoveModel(target);

		const moveLength = moveModel.getMoveLength();
		if (moveLength < 1 || moveLength > 2) {
			return false;
		}

		// Pass active moves (with capture)
		const capturesEndpoints = this.getAvailableCapturesEndpoints(moveModel);

		if (capturesEndpoints.length > 0) {
			const { x, y } = this.castSquareCoordinates(target);
			if (capturesEndpoints.find((square) => square.x === x && square.y === y)) {
				return true;
			}

			// capture necessarily
			return false;
		}

		if (isTeammatesCaptureAvailable(moveModel)) {
			return false;
		}

		return moveLength === 1 && moveModel.isMoveForward();
	}

	isCapturesAvailable(): boolean {
		const moveModel = this._createMoveModel(this.position);
		return this.getAvailableCapturesEndpoints(moveModel).length > 0;
	}

	highlightMoves() {
		const { x, y } = this.castSquareCoordinates(this.position);
		PieceMoveModel.getDiagonals(this.squares, { x, y }).forEach((diagonal) => {
			for (let i = Math.min(2, diagonal.length - 1); i > 0; i--) {
				if (this.canMove(diagonal[i])) {
					do {
						this.highlightSquare(diagonal[i]);
					} while (--i > 0);
				}
			}
		});
	}

	getMoveCaptures(source: TSquareCoordinates, target: TSquareCoordinates): TSquareCoordinates | undefined {
		const moveModel = this._createMoveModel(target);

		if (moveModel.getMoveLength() < 2) {
			return undefined;
		}

		return moveModel
			.getDiagonal(source, target)
			.slice(1)
			.find((square) => {
				return moveModel.isCaptureAvailable({ color: this.color, square: source }, square);
			});
	}

	private getAvailableCapturesEndpoints(moveModel: PieceMoveModel) {
		// Check, is captures available
		const { x, y } = this.castSquareCoordinates(this.position);
		return moveModel.getDiagonals({ x, y }).reduce((acc, diagonal) => {
			if (
				diagonal.length > 2 &&
				moveModel.isCaptureAvailable({ color: this.color, square: { x, y } }, diagonal[1])
			) {
				return [...acc, diagonal[2]];
			}

			return [...acc];
		}, [] as TSquareCoordinates[]);
	}
}
