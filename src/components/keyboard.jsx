import deleteIcon from '../icons/delete.svg';
import '../styles/keyboard.css';

export const KeyBoard = (props) => {
    const keyRow1 = [1, 2, 3, 4];
    const keyRow2 = [5, 6, 7, 8];

    return (
        <div className="KeyBoard">
            <div className="KeyRow" key="KeyRow-1">
                {
                    keyRow1.map((keyTile) => {
                        const key = `key-${keyTile}`;
                        return <div className="KeyTile" key={key} onClick={() => props.handleButtonClick(keyTile)}>{keyTile}</div>
                    })
                }
                <div className="KeyTile" key="key-delete" onClick={() => props.handleButtonClick("delete")}>
                    <img src={deleteIcon} alt="DEL" className='White-svg'/>
                </div>
            </div>
            <div className="KeyRow" key="KeyRow-2">
                {
                    keyRow2.map((keyTile) => {
                        const key = `key-${keyTile}`;
                        return <div className="KeyTile" key={key} onClick={() => props.handleButtonClick(keyTile)}>{keyTile}</div>
                    })
                }
                <div className="KeyTile" key="key-enter" onClick={() => props.handleButtonClick("enter")} style={{fontSize: '12px'}}>ENTER</div>
            </div>
        </div>
    );
}