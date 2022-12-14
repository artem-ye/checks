import { COLOR } from '../../models/colors';
import { selectIsGamePlaying, selectPlayerInfo } from '../../store/game/game';
import { useAppSelector } from '../../store/hooks';
import Badge from '../common/button/Badge';
import Spinner from './clockSpinner';

type PlayerInfoProps = {
	color: COLOR;
	isActive: boolean;
};

const PlayerInfo = ({ color, isActive }: PlayerInfoProps) => {
	const playerInfo = useAppSelector(selectPlayerInfo(color));
	const isGamePlaying = useAppSelector(selectIsGamePlaying);

	const activeClass = isActive && isGamePlaying ? 'font-bold text-white' : '';

	return (
		<div>
			<div className='flex'>
				<div className={` ${activeClass}`}>{color.toUpperCase()} PLAYER</div>
				{isActive && isGamePlaying && <Spinner />}
			</div>
			<div>{playerInfo.name || ''}</div>
			<div>Wins: {playerInfo.wins}</div>
			<div>Defeats: {playerInfo.defeats}</div>
			<div>Draws: {playerInfo.draws}</div>
			{isActive && isGamePlaying && (
				<div>
					<Badge type='danger' onClick={() => {}}>
						Resign
					</Badge>
					<Badge type='primary' onClick={() => {}}>
						Draw
					</Badge>
				</div>
			)}
		</div>
	);
};

export default PlayerInfo;
