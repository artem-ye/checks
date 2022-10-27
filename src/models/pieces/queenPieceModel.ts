import { ISquareCoordinates } from './../types';
import { PieceTypes } from '../pieceTypes';
import { BasePieceModel } from './base/pieceModel';
import { PieceMoveModel, TSquareCoordinates } from './base/pieceMoveModel';
import { isTeammatesCaptureAvailable } from './base/utils';

export class QueenPieceModel extends BasePieceModel {
	static type: PieceTypes = PieceTypes.queen;

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

		if (moveModel.getMoveLength() < 1) {
			return false;
		}

		const captureDiagonals = this.getAvailableCaptures(moveModel);
		const { x, y } = this.castSquareCoordinates(this.position);
		const { x: targetX, y: targetY } = this.castSquareCoordinates(target);

		if (captureDiagonals.length > 0) {
			if (captureDiagonals.find((square) => square.x === targetX && square.y === targetY)) {
				return true;
			}

			return false;
		}

		if (isTeammatesCaptureAvailable(moveModel)) {
			return false;
		}

		// There is no captures. Finally check for
		// free diagonal
		return !moveModel
			.getDiagonal({ x, y }, { x: targetX, y: targetY })
			.slice(1)
			.find((square) => !moveModel.isEmpty(square));
	}

	isCapturesAvailable(): boolean {
		const moveModel = this._createMoveModel(this.position);
		return this.getAvailableCaptures(moveModel).length > 0;
	}

	highlightMoves() {
		const { x, y } = this.castSquareCoordinates(this.position);

		PieceMoveModel.getDiagonals(this.squares, { x, y })
			.map((diagonal) => diagonal.slice(1))
			.forEach((diagonal) => {
				diagonal.forEach((square) => {
					if (this.canMove(square)) {
						this.highlightSquare(square);
						const enemy = this.getMoveCaptures({ x, y }, square);
						if (enemy) {
							this.highlightSquare(enemy);
						}
					}
					// if (this.canMove(square)) {
					// 	this.highlightSquare(diagonal[i]);
					// }
				});

				// for (let i = Math.min(2, diagonal.length - 1); i > 0; i--) {
				// 	if (this.canMove(diagonal[i])) {
				// 		do {
				// 			this.highlightSquare(diagonal[i]);
				// 		} while (--i > 0);
				// 	}
				// }
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

	private getAvailableCaptures(moveModel: PieceMoveModel) {
		const { x, y } = this.castSquareCoordinates(this.position);

		const isCaptureAvailable = (source: TSquareCoordinates, target: TSquareCoordinates): boolean => {
			return moveModel.isCaptureAvailable({ color: this.color, square: { ...source } }, target);
		};

		return (
			moveModel
				.getDiagonals({ x, y })
				// Search for captures
				.reduce((acc, diagonal) => {
					const target = diagonal.slice(1).find((square) => !moveModel.isEmpty(square));

					if (target && isCaptureAvailable({ x, y }, target)) {
						return [...acc, { target, diagonalEndPoint: diagonal[diagonal.length - 1] }];
					}
					return acc;
				}, [] as { target: TSquareCoordinates; diagonalEndPoint: TSquareCoordinates }[])
				// Filtering squares, where piece can be placed after capture
				.map(({ target, diagonalEndPoint }) => moveModel.getDiagonal(target, diagonalEndPoint).slice(1))
				.reduce((acc, diagonal) => {
					// Extract free squares
					const notEmptyFindIndex = diagonal.findIndex((square) => !moveModel.isEmpty(square));
					const freeDiagonal = notEmptyFindIndex >= 0 ? diagonal.slice(0, notEmptyFindIndex) : [...diagonal];

					if (freeDiagonal.length < 2) {
						// diagonal contains only one empty square
						// no more checks needed
						return [...acc, freeDiagonal[0]];
					}

					// Check for perpendicular diagonals attacks
					// Also we need to check last one empty square for
					// forward diagonal attack
					const isLastFreeSquareActive =
						notEmptyFindIndex >= 0 && isCaptureAvailable({ x, y }, diagonal[notEmptyFindIndex]);

					const activeSquares: TSquareCoordinates[] = freeDiagonal.filter((square, index) => {
						if (isLastFreeSquareActive && index === freeDiagonal.length - 1) {
							return true;
						}

						return !!PieceMoveModel.getPerpendicularEndPoints({ x, y }, square)
							.map((endPoint) => moveModel.getDiagonal(square, endPoint))
							.find((perpendicular) => {
								const findSquare = perpendicular.find((square) => !moveModel.isEmpty(square));
								return findSquare && isCaptureAvailable(square, findSquare);
							});
					});

					if (activeSquares.length > 0) {
						return [...acc, ...activeSquares];
					}
					return [...acc, ...freeDiagonal];
				}, [] as TSquareCoordinates[])
		);
	}
}
