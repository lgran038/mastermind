import '../styles/dialog.css';
import { Dialog } from './dialog';

export const GameEndDialog = ({playerWon, code, timeTaken, attempts, maxGuesses, onConfirm, onClose}) => {
    const renderTime = (time) => {
        return <div>{`Time: ${new Date(time).toISOString().slice(11,19)}`}</div>
    }

    return (
        <Dialog onClose={onClose}>
            <div className="DialogMessage">
                <h1>You {playerWon ? 'win!' : 'lose :('} Play Again?</h1>
                <h2>Code: {code.join(' ')}</h2>
                <div className="DialogStats">
                    {renderTime(timeTaken)}
                    <div>{`Score: ${playerWon ? attempts : ` --` }/${maxGuesses}`}</div>
                </div>
            </div>
            <div className="DialogPlayButton" onClick={() => onConfirm()}>Play Again</div>
        </Dialog>
    )
}