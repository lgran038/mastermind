import clsx from "clsx";
import { useEffect, useState } from "react";

const GameTile = ({ tile, tileIndex, animate, submitted, focused }) => {
    const [ isAnimated, setAnimated ] = useState(false);
    
    useEffect(() => {
        if (animate) {
            setAnimated(true);

            setTimeout(() => {
                setAnimated(false)
            }, 100);
        }
    }, [ animate ]);
    
    return <div 
                className={clsx('GameTile', isAnimated && 'GTAnimate', submitted && 'GTSubmitted', focused && 'GTFocused')} 
                key={`gameTile-${tileIndex}`}
                >{tile}</div>;
}

const GameRow = ({ rowIndex, tiles, submitted, animateTile, correctMatches, partialMatches, focused }) => {
    const [ animateCorrectHint, setAnimateCorrectHint ] = useState(false);
    const [ animatePartialHint, setAnimatePartialHint ] = useState(false);

    useEffect(() => {
        if (submitted) {
            setAnimateCorrectHint(true);
            setAnimatePartialHint(true);

            setTimeout(() => {
                setAnimateCorrectHint(false);
                setAnimatePartialHint(false);
            }, 100);
        }
    }, [ submitted, correctMatches, partialMatches ]);

    const gameTiles = tiles.map((tile, tileIndex) => {
        return <GameTile tile={tile} tileIndex={tileIndex} submitted={submitted} animate={tileIndex === animateTile} focused={focused} key={tileIndex}/>
    });

    const hintCorrectClassName = `GameHint HintCorrect ${animateCorrectHint ? 'HintAnimated' : ''} ${focused ? 'HintFocused' : ''}`;
    const hintPartialClassName = `GameHint HintPartial ${animatePartialHint ? 'HintAnimated' : ''} ${focused ? 'HintFocused' : ''}`;

    return (
        <div className="GameRow" key={`gameRow-${rowIndex}`}>
            <div className="GameTileRow">
                {gameTiles}
            </div>
            <div className="GameHintTile">
                <div className={hintCorrectClassName}>{correctMatches}</div>
                <div className={hintPartialClassName}>{partialMatches}</div>
            </div> 
        </div>
    );
}

export const GameBoard = ({rows, focusedRow}) => {
    return (
        <div className="GameBoard">
            {rows.map((row, rowIndex) => {
                return <GameRow 
                        tiles={row.values} 
                        rowIndex={rowIndex}
                        correctMatches={row.correctMatches}
                        partialMatches={row.partialMatches}
                        submitted={row.submitted}
                        animateTile={row.animateTile}
                        focused={focusedRow === rowIndex}
                        key={rowIndex}
                        />
            })}
        </div>
    );
}