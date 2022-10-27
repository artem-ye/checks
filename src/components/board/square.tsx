import { COLOR } from '../../models/colors';
import { ISquare } from '../../models/types';
import Piece from './piece';

type SquareProps = {
	square: ISquare;
	isActive: Boolean;
	onClick: (square: ISquare) => void;
};

const BG_BLACK = 'bg-black';
const BG_WHITE = 'bg-[#dcdeea29]';
// const BG_ACTIVE = 'bg-[#27364]';
const BG_HIGHLIGHTED = 'bg-[#009688c2]';
const BG_ACTIVE = BG_HIGHLIGHTED;
const BG_HIGHLIGHTED_PIECE = 'bg-[#a43434]';

function Square({ square, isActive, onClick }: SquareProps) {
	const bgColor =
		(square.isHighlighted && square.piece && BG_HIGHLIGHTED_PIECE) ||
		(square.isHighlighted && BG_HIGHLIGHTED) ||
		(isActive && BG_ACTIVE) ||
		(square.color === COLOR.BLACK ? BG_BLACK : BG_WHITE);

	const handleClick = () => {
		onClick(square);
	};

	return (
		<div className={`w-28 h-28 flex justify-center items-center overflow-hidden ${bgColor}`} onClick={handleClick}>
			{square.piece && <Piece piece={square.piece} />}
		</div>
	);
}

export default Square;
