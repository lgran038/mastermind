import './styles/App.css';
import { Header } from './components/header';
import { Game } from './components/game';

function App() {
    return (
        <div className="App">
            <div className="App-body">
                <Header/>
                <Game/>
            </div>
        </div>
    );
}

export default App;
