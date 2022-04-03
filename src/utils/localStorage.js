// update current guess
export const setGuessStore = (value) => {
    localStorage.setItem('currentGuess', value);
}

// retrieve current guess
export const getGuessStore = () => {
    const guessStore = localStorage.getItem('currentGuess');
    return guessStore !== null ? guessStore : '';
}

// update local storage running guesses
export const setGuessesStore = (rows, reset) => {
    if (reset) {
        localStorage.setItem('guesses', '');
    }
    else {

        console.log('inside set guesses store');
        console.log(rows);
        let values = '';
        
        rows.forEach(row => {
            values += `${row.values.join('')}:${row.correctMatches}:${row.partialMatches},` 
        });
        
        values = values.slice(0, -1);

        localStorage.setItem('guesses', values);

        console.log('values')
        console.log(values)
        console.log('finished inside set guesses store')
    }
}

// update running guesses
export const getGuessesStore = () => {
    const guessesStore = localStorage.getItem('guesses');
    return guessesStore !== null ? guessesStore : '';
}

// update target code
export const setTargetCodeStore = (code) => {
    localStorage.setItem('targetCode', code);
}

// gets target code
export const getTargetCodeStore = () => {
    const targetCode = localStorage.getItem('targetCode');
    console.log('targetcode')
    console.log(targetCode);
    return targetCode !== null ? targetCode : '';
}

// sets current row
export const setCurrentRowStore = (rowIndex) => {
    localStorage.setItem('currentRow', rowIndex);
}

// gets current row
export const getCurrentRowStore = () => {
    const currentRow = localStorage.getItem('currentRow');
    return currentRow !== null ? Number(currentRow) : 0;
}

// sets game over
export const setGameOverStore = (value) => {
    localStorage.setItem('gameOver', value);
}

// gets game over
export const getGameOverStore = () => {
    const gameOver = localStorage.getItem('gameOver');
    return gameOver !== null ? gameOver === 'true' : false;
}