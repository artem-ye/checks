// import { BoardModel } from '../../models/boardModel';
import { useEffect } from 'react';
import { ISquare } from '../../models/types';
import { selectSquare, selectActiveSquare, selectSquares, setPieces, move } from '../../store/board/board';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Square from './square';

const COLUMNS_ORDER = [0, 1, 2, 3, 4, 5, 6, 7];
const ROWS_ORDER = COLUMNS_ORDER.reverse();

function Board() {
	const squares = useAppSelector(selectSquares);
	const activeSquare = useAppSelector(selectActiveSquare);
	// const activePlayerColor = useAppSelector(selectActivePlayer);
	const dispatch = useAppDispatch();

	const handleSquareClick = (square: ISquare) => {
		if (square.piece) {
			dispatch(selectSquare(square));
		} else {
			activeSquare && dispatch(move(activeSquare, square));
		}
	};

	useEffect(() => {
		// dispatch(setPieces());
	}, [dispatch]);

	return (
		<div className='flex flex-col items-center'>
			{ROWS_ORDER.map((y) => {
				return (
					<div key={y} className='flex'>
						{COLUMNS_ORDER.map((x) => {
							const square = squares[y][x];

							return (
								<Square
									key={square.id}
									square={square}
									isActive={activeSquare?.x === x && activeSquare?.y === y}
									onClick={handleSquareClick}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}

export default Board;
