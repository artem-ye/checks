import { COLOR } from '../../models/colors';
import { selectPlayerInfo } from '../../store/game/game';
import { useAppSelector } from '../../store/hooks';
// import Button from '../common/button/Button';
import Badge from '../common/button/Badge';
import Spinner from './clockSpinner';

type PlayerInfoProps = {
	color: COLOR;
	isActive: boolean;
};

const PlayerInfo = ({ color, isActive }: PlayerInfoProps) => {
	const activeClass = isActive ? 'font-bold text-white' : '';
	const playerInfo = useAppSelector(selectPlayerInfo(color));

	return (
		<div>
			<div className='flex'>
				<div className={` ${activeClass}`}>{color.toUpperCase()} PLAYER</div>
				{isActive && <Spinner />}
			</div>
			{isActive && (
				<div>
					<Badge type='danger' onClick={() => {}}>
						Resign
					</Badge>
					<Badge type='primary' onClick={() => {}}>
						Draw
					</Badge>
				</div>
			)}
			<div>{playerInfo.name || ''}</div>
			{/* <div>Color: {color}</div> */}
			<div>Wins: {playerInfo.wins}</div>
			<div>Defeats: {playerInfo.defeats}</div>
			<div>Draws: {playerInfo.draws}</div>
		</div>
	);
};

export default PlayerInfo;
