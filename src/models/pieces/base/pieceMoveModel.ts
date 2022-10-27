import { ISquareCoordinates, ISquares, IPiece, ISquare } from './../../types';
import { COLOR } from '../../colors';
import { PieceTypes } from '../../pieceTypes';

const TOP_SQUARE_INDEX = 7;

export type TSquareCoordinates = {
	x: number;
	y: number;
};

export class PieceMoveModel {
	readonly squares: ISquares;
	readonly source: TSquareCoordinates;
	readonly target: TSquareCoordinates;
	readonly isValid: boolean;
	validationError?: string;

	constructor(squares: ISquares, source: ISquareCoordinates, target: ISquareCoordinates) {
		this.squares = squares;
		this.source = _normalizeSquareCoordinates(source);
		this.target = _normalizeSquareCoordinates(target);
		this.isValid = this.isValidMove();
	}

	// Public static methods
	static isValidSquare(target: TSquareCoordinates) {
		return target.x >= 0 && target.x < 8 && target.y >= 0 && target.y < 8;
	}

	static isDiagonal(source: TSquareCoordinates, target: TSquareCoordinates): boolean {
		if (!PieceMoveModel.isValidSquare(source) || !PieceMoveModel.isValidSquare(target)) {
			return false;
		}
		const dX = Math.abs(source.x - target.x);
		const dY = Math.abs(source.y - target.y);
		return dX === dY;
	}

	static getDiagonalsEndPoints(square: TSquareCoordinates) {
		const { x, y } = square;

		const endPoints: TSquareCoordinates[] = [];

		// Symmetric diagonal
		let offset: number = Math.min(x, y);
		offset !== 0 && endPoints.push({ x: x - offset, y: y - offset });

		offset = Math.min(TOP_SQUARE_INDEX - x, TOP_SQUARE_INDEX - y);
		offset !== 0 && endPoints.push({ x: x + offset, y: y + offset });

		// Asymmetric diagonal
		offset = Math.min(x, TOP_SQUARE_INDEX - y);
		offset !== 0 && endPoints.push({ x: x - offset, y: y + offset });

		offset = Math.min(TOP_SQUARE_INDEX - x, y);
		offset !== 0 && endPoints.push({ x: x + offset, y: y - offset });

		return endPoints;
	}

	static getDiagonal(
		squares: ISquares,
		source: TSquareCoordinates,
		target: TSquareCoordinates
	): TSquareCoordinates[] {
		const retVal: TSquareCoordinates[] = [];

		if (!PieceMoveModel.isDiagonal(source, target)) {
			return retVal;
		}
		const dX = source.x < target.x ? 1 : -1;
		const dY = source.y < target.y ? 1 : -1;
		for (let i = 0; i <= Math.abs(source.x - target.x); i++) {
			const x = source.x + i * dX;
			const y = source.y + i * dY;
			retVal.push(squares[y][x]);
		}
		return retVal;
	}

	static getDiagonals(squares: ISquares, position: TSquareCoordinates) {
		return this.getDiagonalsEndPoints(position).map((endPoint) => this.getDiagonal(squares, position, endPoint));
	}

	static getPerpendicularEndPoints(source: TSquareCoordinates, target: TSquareCoordinates) {
		const { x, y } = target;

		const endPoints: TSquareCoordinates[] = [];
		const isSymmetricDiagonal = (source.x < x && source.y < y) || (source.x > x && source.y > y);

		if (isSymmetricDiagonal) {
			let offset = Math.min(x, TOP_SQUARE_INDEX - y);
			offset !== 0 && endPoints.push({ x: x - offset, y: y + offset });

			offset = Math.min(TOP_SQUARE_INDEX - x, y);
			offset !== 0 && endPoints.push({ x: x + offset, y: y - offset });
		} else {
			let offset: number = Math.min(x, y);
			offset !== 0 && endPoints.push({ x: x - offset, y: y - offset });

			offset = Math.min(TOP_SQUARE_INDEX - x, TOP_SQUARE_INDEX - y);
			offset !== 0 && endPoints.push({ x: x + offset, y: y + offset });
		}

		return endPoints;
	}

	static isTransformationFieldReached(piece: IPiece, target: TSquareCoordinates): boolean {
		if (piece.type === PieceTypes.queen) {
			return false;
		}

		return (piece.color === COLOR.WHITE && target.y === 7) || (piece.color === COLOR.BLACK && target.y === 0);
	}

	// Public methods
	getFriendlyPiecesSquares(): ISquare[] {
		const friendlySquares: ISquare[] = [];

		const color = this.getSquare(this.source)?.piece?.color;
		const { x, y } = this.source;

		if (!color) {
			return friendlySquares;
		}

		this.squares.forEach((row) => {
			row.forEach((square: ISquare) => {
				if (square?.piece?.color !== color) {
					return;
				}
				if (square.x === x && square.y === y) {
					return;
				}

				friendlySquares.push(square);
			});
		});

		return friendlySquares;
	}

	getMoveLength(): number {
		if (!this.isDiagonalMove()) {
			return 0;
		}
		return Math.abs(this.source.y - this.target.y);
	}

	getDiagonal(source: ISquareCoordinates, target: ISquareCoordinates): TSquareCoordinates[] {
		const _source = _normalizeSquareCoordinates(source);
		const _target = _normalizeSquareCoordinates(target);
		return PieceMoveModel.getDiagonal(this.squares, _source, _target);

		// const retVal: TSquareCoordinates[] = [];
		// const _source = _normalizeSquareCoordinates(source);
		// const _target = _normalizeSquareCoordinates(target);
		// if (!PieceMoveModel.isDiagonal(_source, _target)) {
		// 	return retVal;
		// }
		// const dX = _source.x < _target.x ? 1 : -1;
		// const dY = _source.y < _target.y ? 1 : -1;
		// for (let i = 0; i <= Math.abs(_source.x - _target.x); i++) {
		// 	retVal.push(
		// 		this.getSquare({
		// 			x: _source.x + i * dX,
		// 			y: _source.y + i * dY,
		// 		})
		// 	);
		// }
		// return retVal;
	}

	getDiagonals(source: TSquareCoordinates): TSquareCoordinates[][] {
		return PieceMoveModel.getDiagonals(this.squares, source);
	}

	isDiagonalMove(): boolean {
		if (!this.isValid) {
			return false;
		}
		return PieceMoveModel.isDiagonal(this.source, this.target);
	}

	isTargetBlocked(): boolean {
		return this.isMoveBlocked(this.source, this.target);
	}

	isEnemy(target: ISquareCoordinates): boolean {
		const { x, y } = _normalizeSquareCoordinates(target);
		const enemyPiece = this.getSquare({ x, y }).piece;
		if (!enemyPiece) {
			return false;
		}
		return enemyPiece.color !== this.piece?.color;
	}

	isMoveForward(): boolean {
		if (!this.isValid) {
			return false;
		}
		const dY = this.source.y - this.target.y;
		const PIECE_COLOR = this.piece?.color;
		return (PIECE_COLOR === COLOR.WHITE && dY < 0) || (PIECE_COLOR === COLOR.BLACK && dY > 0);
	}

	isEmpty(target: TSquareCoordinates): boolean {
		return !!this.getSquare(target).piece ? false : true;
	}

	isMoveBlocked(source: TSquareCoordinates, target: TSquareCoordinates): boolean {
		if (!PieceMoveModel.isDiagonal(source, target) || this.isEmpty(source)) {
			return true;
		}

		if (this.isEmpty(target)) {
			return false;
		}

		const sourcePieceColor = this.getSquare(source).piece?.color;
		if (!sourcePieceColor) {
			return true;
		}

		return !this.isCaptureAvailable({ color: sourcePieceColor, square: source }, target);
	}

	isCaptureAvailable(attacker: { color: COLOR; square: TSquareCoordinates }, target: TSquareCoordinates) {
		if (this.isEmpty(target) || this.getSquare(target).piece?.color === attacker.color) {
			return false;
		}

		// Next square must be empty to capture current
		const x = target.x + (attacker.square.x < target.x ? 1 : -1);
		const y = target.y + (attacker.square.y < target.y ? 1 : -1);
		return PieceMoveModel.isValidSquare({ x, y }) && this.isEmpty({ x, y });
	}

	// Service methods
	getSquare(square: TSquareCoordinates) {
		return this.squares[square.y][square.x];
	}

	isValidMove(): boolean {
		if (this.source.x === this.target.x && this.source.y === this.target.y) {
			this.validationError = `source[${this.source.y}][${this.source.x}] === target[${this.target.y}][${this.target.x}]`;
			return false;
		}
		if (!this.piece) {
			this.validationError = 'source.piece === false';
			return false;
		}
		return true;
	}

	get piece(): IPiece | null {
		return this.getSquare(this.source).piece;
	}

	get targetPiece(): IPiece | null {
		return this.getSquare(this.target).piece;
	}
}

function _normalizeSquareCoordinates(position: ISquareCoordinates): TSquareCoordinates {
	return {
		x: position.x || 0,
		y: position.y || 0,
	};
}
