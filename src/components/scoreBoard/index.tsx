import { COLOR } from '../../models/colors';
import { selectActivePlayer } from '../../store/board/board';
import { useAppSelector } from '../../store/hooks';
import PlayerInfo from './palyerInfo';

const ScoreBoard = () => {
	const activePlayerColor = useAppSelector(selectActivePlayer);

	return (
		<div>
			<PlayerInfo color={COLOR.WHITE} isActive={activePlayerColor === COLOR.WHITE} />
			<br />
			<div className='font-bold'>VS</div>
			<br />
			<PlayerInfo color={COLOR.BLACK} isActive={activePlayerColor === COLOR.BLACK} />
		</div>
	);
};

export default ScoreBoard;
