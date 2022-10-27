import { ISquares, ISquareCoordinates, IPiece } from './../../types';
import { PieceTypes } from '../../pieceTypes';
import { COLOR } from '../../colors';
import { PieceMoveModel, TSquareCoordinates } from './pieceMoveModel';

type ITypeLessPiece = Omit<IPiece, 'type'>;
type ICreateObjectProps = Omit<ITypeLessPiece, 'id'>;

export interface IBasePieceModel {
	canMove: (target: ISquareCoordinates) => boolean;
	isCapturesAvailable: () => boolean;
}

export abstract class BasePieceModel implements ITypeLessPiece {
	readonly color: COLOR;
	readonly id: number;
	static readonly type: PieceTypes;
	squares: ISquares;
	position: ISquareCoordinates;

	constructor(piece: ITypeLessPiece, squares: ISquares, position: ISquareCoordinates) {
		this.color = piece.color;
		this.id = piece.id;
		this.squares = squares;
		this.position = position;
	}

	static createObject(props: ICreateObjectProps): IPiece {
		if (this?.type === undefined) {
			throw new Error('static property "type" must be redefined in child class ');
		}
		return {
			...props,
			type: this.type,
			id: Math.random(),
		};
	}

	canMove(target: ISquareCoordinates): boolean {
		if (this._isEmptyTarget(target)) {
			throw new Error('PieceModel.cansMove target cant be null');
		}

		if (this._isEmptyPosition()) {
			throw new Error(
				'PieceModel.canMove position property not initialized X:' + this.position.x + ' Y:' + this.position.y
			);
		}

		const moveModel = this._createMoveModel(target);
		if (!moveModel.isDiagonalMove()) {
			return false;
		}

		if (moveModel.isTargetBlocked()) {
			return false;
		}

		return true;
	}

	abstract isBlocked(): boolean;

	abstract isCapturesAvailable(): boolean;

	abstract highlightMoves(): void;

	abstract getMoveCaptures(source: TSquareCoordinates, target: TSquareCoordinates): TSquareCoordinates | undefined;

	protected highlightSquare(square: TSquareCoordinates) {
		const target = this.squares[square.y][square.x];
		if (!target.isHighlighted) {
			target.isHighlighted = true;
		}
	}

	protected castSquareCoordinates(target: ISquareCoordinates): TSquareCoordinates {
		return {
			x: target?.x || 0,
			y: target?.y || 0,
		};
	}

	protected _createMoveModel(target: ISquareCoordinates): PieceMoveModel {
		return new PieceMoveModel(this.squares, this.position, target);
	}

	private _isEmptyTarget(target: ISquareCoordinates): boolean {
		return target.x === null || target.y === null;
	}

	private _isEmptyPosition() {
		return this.position.x === null || this.position.y === null;
	}
}
