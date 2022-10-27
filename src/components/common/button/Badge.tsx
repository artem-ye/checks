type ButtonProps = {
	type: 'primary' | 'secondary' | 'danger';
	onClick: () => void;
	children: any;
};

const STYLE =
	'mt-3 inline-flex w-full justify-center' +
	' rounded border ' +
	' px-1 text-base font-medium text-gray-700 ' +
	// ' hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
	' focus:outline-none' +
	// ' hover:bg-gray-50 focus:outline-none ' +
	' sm:mt-0 sm:mr-1 sm:w-auto sm:text-sm';

const Badge = ({ type, children, onClick }: ButtonProps) => {
	let className = STYLE;

	if (type === 'primary') {
		className += ' bg-white hover:bg-gray-50 focus:ring-gray-400';
	} else if (type === 'secondary') {
		className += ' bg-slate-200 hover:bg-gray-50 focus:ring-gray-700';
	} else {
		className += ' bg-red-600 text-[white] focus:ring-red-400 border-red-600 ';
	}

	return (
		<button type='button' className={className} onClick={onClick}>
			{children}
		</button>
	);
};

export default Badge;
