import { ReactNode } from 'react';

export interface IHandleChangeProps {
	key: string;
	value: any;
}

export interface IControlComponent {
	name: string;
	title: ReactNode;
	value: string;
	onChange: (data: IHandleChangeProps) => void;
	placeHolder?: string;
}
