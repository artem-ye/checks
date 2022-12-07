// import DialogBox from '../common/form/dialogBox/dialogBox';

import { useState } from 'react';
import Modal from '../common/form/modal/modal';
import Input from '../common/form/components/input';
import { IHandleChangeProps } from '../common/form/components/types';
import Button from '../common/button/Button';

export interface INewGameDialogData {
	whitePlayerName: string;
	blackPlayerName: string;
}

type TNewGameDialogProps = {
	onCancel: () => void;
	onSubmit: (data: INewGameDialogData) => void;
	initialState: INewGameDialogData;
};

const NewGameDialog = ({ onCancel, onSubmit, initialState }: TNewGameDialogProps) => {
	const [data, setData] = useState({
		whitePlayerName: initialState.whitePlayerName,
		blackPlayerName: initialState.blackPlayerName,
	});

	const handleDataChange = (data: IHandleChangeProps) => {
		setData((prev) => {
			return { ...prev, [data.key]: data.value };
		});
	};

	const handleSubmit = () => {
		onSubmit(data);
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<Modal>
			<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
				<div className=''>
					<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
						<h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-title'>
							New game
						</h3>
						<div className='mt-2'>
							<span className='text-base text-gray-500'>
								<Input
									name='whitePlayerName'
									title={<>White&nbsp;player&nbsp;name</>}
									placeHolder='White player'
									value={data.whitePlayerName}
									onChange={handleDataChange}
								></Input>
								<Input
									name='blackPlayerName'
									title={<>Black&nbsp;player&nbsp;name</>}
									placeHolder='Black player'
									value={data.blackPlayerName}
									onChange={handleDataChange}
								></Input>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
				<Button type={'primary'} onClick={handleSubmit}>
					Start new game
				</Button>
				<Button type={'danger'} onClick={handleCancel}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
};

export default NewGameDialog;
