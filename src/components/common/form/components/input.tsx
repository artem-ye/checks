import { IControlComponent } from './types';

const Input = ({ name, title, value, onChange, placeHolder = '' }: IControlComponent) => {
	const handleChange = (e: any) => {
		onChange({ key: name, value: e.target.value });
	};

	return (
		<div className='flex items-center mb-2'>
			<label htmlFor={name} className='block mr-14'>
				{title}
			</label>
			<input
				type='text'
				name={name}
				id={name}
				className='block w-full rounded-md border-gray-300  sm:text-sm pl-3 pr-3 pt-2 pb-2'
				placeholder={placeHolder}
				value={value}
				onChange={handleChange}
			/>
		</div>
	);
};

export default Input;
