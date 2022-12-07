import React from 'react';
import { COLOR } from '../../models/colors';
import { resetBoard } from '../../store/board/board';
import { selectPlayerInfo } from '../../store/game/game';
import { hideNewGameRequest, showNewGameRequest, selectIsNewGameRequested, startNewGame } from '../../store/game/game';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Button from '../common/button/Button';
import NewGameDialog, { INewGameDialogData } from '../newGameDialog';

function Header() {
	const dispatch = useAppDispatch();
	const isNewGameRequested = useAppSelector(selectIsNewGameRequested);

	const newGameDialogInitialState: INewGameDialogData = {
		whitePlayerName: useAppSelector(selectPlayerInfo(COLOR.WHITE)).name,
		blackPlayerName: useAppSelector(selectPlayerInfo(COLOR.BLACK)).name,
	};

	const handleNewGameClick = () => {
		dispatch(showNewGameRequest());
	};

	const handleCancel = () => {
		dispatch(hideNewGameRequest());
	};

	const handleSubmit = (data: INewGameDialogData) => {
		const { blackPlayerName, whitePlayerName } = data;
		dispatch(startNewGame({ blackPlayerName, whitePlayerName }));
		dispatch(resetBoard());
	};

	return (
		<>
			<header className='bg-gray-800 p-3 font-bold flex flex-row justify-between'>
				<span className='inline-flex items-center justify-center'>Classic Checks</span>
				<div>
					<Button type='primary' onClick={handleNewGameClick}>
						New game
					</Button>
				</div>
			</header>
			{isNewGameRequested && (
				<NewGameDialog
					onCancel={handleCancel}
					onSubmit={handleSubmit}
					initialState={newGameDialogInitialState}
				/>
			)}
		</>
	);
}

export default Header;
