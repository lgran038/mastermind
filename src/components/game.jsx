import '../styles/game.css';
import '../styles/board.css';
import { useEffect, useState, useRef } from "react";
import { GameBoard } from './board';
import { KeyBoard } from './keyboard';
import { GameEndDialog } from "./gameEndDialog";
import { 
    setGuessStore, getGuessStore, 
    setGuessesStore, getGuessesStore, 
    setTargetCodeStore, getTargetCodeStore,
    setCurrentRowStore, getCurrentRowStore,
    setGameOverStore, getGameOverStore
} from '../utils/localStorage';

const setEmptyRow = (row, codeLength) => {
    for (let i = 0; i < codeLength; i++) {
        row.values[i] = '';
    }
}

const initRows = (maxGuesses, codeLength, guessesStore, guessStore) => {
    let rows = [];
    if (guessesStore !== '') {
        let guesses = guessesStore.split(',');
        let addedCurrentGuess = false;
        guesses.forEach((guess, index) => {
            let params = guess.split(':');
            const submitted = params[0] !== '';
            let values = params[0].split('');
            if (!submitted) {
                if (!addedCurrentGuess && guessStore !== '') {
                    values = guessStore.split('');
                    addedCurrentGuess = true;
                }

                for (let i = 0; i < codeLength; i++) {
                    if (!values[i])
                        values[i] = '';
                }
            }
            
            rows.push({ 
                values:  values,
                submitted: submitted,
                correctMatches: Number(params[1]),
                partialMatches: Number(params[2]),
                animateTile: -1
            })
        });
    }
    else {
        for (let i = 0; i < maxGuesses; i++) {
            rows.push({values: [], submitted: false, correctMatches: 0, partialMatches: 0, animateTile: -1});
            setEmptyRow(rows[i], codeLength);
        }
    }

    return rows;
}

const initTargetCode = (codeLength, maxCodeDigit, targetCodeStore) => {
    if (targetCodeStore !== '')
        return targetCodeStore.split('');

    let targetCode = [];
    for (let i = 0; i < codeLength; i++) {
        targetCode.push((Math.floor(Math.random() * maxCodeDigit) + 1).toString());
    }

    if (!targetCodeStore || targetCodeStore === '')
        setTargetCodeStore(targetCode.join(''));

    return targetCode;
}

export const Game = () => {
    const maxGuesses = 12;
    const codeLength = 4;
    const maxCodeDigit = 8;
    // const targetCode = ['1', '1', '2', '3'];
    const [ targetCode, setGameTargetCode ] = useState(() => initTargetCode(codeLength, maxCodeDigit, getTargetCodeStore()));
    const [ rows, setGameRows ] = useState(() => initRows(maxGuesses, codeLength, getGuessesStore(), getGuessStore()));
    const [ currentRowIndex, setCurrentGameRow ] = useState(getCurrentRowStore());
    const [ gameOver, setGameOverState ] = useState(getGameOverStore());
    const [ displayDialog, setDisplayDialog ] = useState(false);
    const [ playerWon, setPlayerWon ] = useState(false);
    const [ startTime, setStartTime ] = useState(new Date());
    const [ endTime, setEndTime ] = useState(new Date());

    const mainRef = useRef(null);
    
    useEffect(() => {
        mainRef.current.focus();
    }, []);

    const setTargetCode = (code) => {
        // update game
        setGameTargetCode(code);

        // update storage
        setTargetCodeStore(code.join(''));
    }

    const setRows = (rows) => {
        // update game
        setGameRows(rows);

        // update storage
        setGuessStore(rows[currentRowIndex].values.join(''))
    }

    const setCurrentRow = (currentRowIndex) => {
        // update game
        setCurrentGameRow(currentRowIndex);

        // update storage
        setCurrentRowStore(currentRowIndex);
    }

    const setGameOver = (value) => {
        // update game
        setGameOverState(value);

        // update store
        setGameOverStore(value);
    }

    const setValueInRow = (rowIndex, valueIndex, value, animateTile) => {
        // 1. Make a shallow copy of the items
        let tempRows = [...rows];
        // 2. Make a shallow copy of the item you want to mutate
        let row = {...tempRows[rowIndex]};
        // 3. Replace the property you're intested in
        row.values[valueIndex] = value.toString();
        row.animateTile = animateTile ? valueIndex : -1;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        tempRows[rowIndex] = row;
        setRows(tempRows);
    }

    const handleNumberInput = (number) => {
        const currentRow = rows[currentRowIndex];
        const firstEmpty = currentRow.values.indexOf('');
        if (!gameOver && firstEmpty !== -1) {
            setValueInRow(currentRowIndex, firstEmpty, number, true);
        }
    }
    
    const handleDelete = () => {
        const currentRow = rows[currentRowIndex];
        const firstEmpty = currentRow.values.indexOf('');
        if (!gameOver && firstEmpty !== 0) {
            let indexToDelete = firstEmpty === -1 ? currentRow.values.length - 1 : firstEmpty - 1;
            setValueInRow(currentRowIndex, indexToDelete, '', false);
        }
    }

    const resolveHints = (input) => {
        let correct = 0;
        let partial = 0;
        let targetCodeCopy = [...targetCode];
        let inputCopy = [...input]

        // find exact matches and reset its value
        for (let i = 0; i < input.length; i++) {
            if (targetCodeCopy[i] === inputCopy[i]) {
                correct++;
                targetCodeCopy[i] = '';
                inputCopy[i] = 'X';
            }
        }

        // find partial matches
        for (let i = 0; i < input.length; i++) {
            let indexInTarget = targetCodeCopy.indexOf(inputCopy[i]);
            if (indexInTarget !== -1) {
                partial++;
                targetCodeCopy[indexInTarget] = '';
            }
        }

        return {
            correct: correct,
            partial: partial
        }
    }

    const handleSumbit = () => {
        const currentRow = rows[currentRowIndex];
        const firstEmpty = currentRow.values.indexOf('');
        if (!gameOver && !currentRow.submitted) {         
            // Make a copy of rows
            let tempRows = [...rows];
            // Make a copy of row to update
            let row = {...tempRows[currentRowIndex]};
            if (firstEmpty === -1) {
                // Updating hints
                let hints = resolveHints(row.values)
                row.correctMatches = hints.correct;
                row.partialMatches = hints.partial;
                row.submitted = true;
            }
            else {
                setEmptyRow(row, codeLength);
            }

            // Update rows with new row
            tempRows[currentRowIndex] = row;
            setRows(tempRows);

            // update store with new rows
            setGuessesStore(tempRows, false);

            // Update game state only on completed rows
            if (firstEmpty === -1) {
                setGuessStore('');
                if (row.correctMatches === codeLength || currentRowIndex + 1 === maxGuesses) {
                    setCurrentRow(-1);
                    setPlayerWon(row.correctMatches === codeLength);           
                    setGameOver(true);
                    setDisplayDialog(true);
                    setEndTime(new Date());
                }
                else {
                    setCurrentRow(currentRowIndex + 1);
                } 
            }
        }
    }

    const handlePlayAgain = () => {
        setGameOver(false);
        setDisplayDialog(false);
        setCurrentRow(0);
        setGuessesStore(rows, true);
        setTargetCode(initTargetCode(codeLength, maxCodeDigit, ''));
        setRows(initRows(maxGuesses, codeLength, '', ''));
        setStartTime(new Date());
    }

    const handleKeyDown = (e) => {
        if (!isNaN(e.key) && (Number(e.key) > 0 && Number(e.key) < 9)) {
            handleNumberInput(e.key);
        }
        else if (e.key === 'Backspace' || e.key === 'Delete') {
            handleDelete();
        }
        else if (e.key === 'Enter') {
            handleSumbit();
        }
    }

    const handleButtonClick = (value) => {
        if (value === "delete") {
            handleDelete();
        }
        else if (value === "enter") {
            handleSumbit();
        }
        else {
            handleNumberInput(value);
        }
    }

    return (
        <div className="GameContainer noSelect" onKeyDown={(e) => handleKeyDown(e)} tabIndex="-1" ref={mainRef}>
            {gameOver && <div className="NewGameButton" onClick={() => handlePlayAgain()}>New Game</div>}
            <div className="GameBoardContainer">
                <GameBoard rows={rows} focusedRow={currentRowIndex}/>
            </div>
            <KeyBoard handleButtonClick={handleButtonClick}/>
            {displayDialog && 
                <GameEndDialog 
                    playerWon={playerWon} 
                    code={targetCode} 
                    timeTaken={endTime - startTime} 
                    attempts={currentRowIndex + 1} 
                    maxGuesses={maxGuesses} 
                    onConfirm={() => handlePlayAgain()} 
                    onClose={() => setDisplayDialog(false)}
                />
            }
        </div>
    )
}