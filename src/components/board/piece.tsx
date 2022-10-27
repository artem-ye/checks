import { COLOR } from '../../models/colors';
import { PieceTypes } from '../../models/pieceTypes';
import { IPiece } from '../../models/types';

const BLACK = 'text-[#61dafb]';
const WHITE = 'text-[#ffffff]';

type PieceProps = {
	piece: IPiece;
};

function Piece({ piece }: PieceProps) {
	const colorStyle = piece.color === COLOR.BLACK ? BLACK : WHITE;

	if (piece.type === PieceTypes.queen) {
		return <div className={`font-bold text-[135px] drop-shadow-md ${colorStyle}`}>&#9055;</div>;
	}

	return <div className={`font-bold text-[154px] drop-shadow-md ${colorStyle}`}>&#9900;</div>;
}

export default Piece;
