import { Provider } from 'react-redux';
import './App.css';
import Board from './components/board';
import Header from './components/header/header';
import ScoreBoard from './components/scoreBoard';
import { store } from './store/store';

function App() {
	return (
		<>
			<Provider store={store}>
				<Header />
				<main className='p-3 flex flex-row justify-center'>
					<div>
						<Board />
					</div>
					<div className='ml-10'>
						<ScoreBoard />
					</div>
				</main>

				{/* <NewGameDialog /> */}
			</Provider>
		</>
	);
}

export default App;
