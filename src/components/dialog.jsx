import '../styles/dialog.css';
import closeIcon from '../icons/close.svg';

export const Dialog = (props) => {
    const { onClose, children } = props;

    return (
        <div className="DialogOverlay">
            <div className="Dialog">
                <div className="DialogClose" onClick={() => onClose()}>
                    <img src={closeIcon} alt="X" className='Gray-svg'/>
                </div>
                {children}
            </div>
        </div>
    );
}