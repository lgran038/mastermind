import '../styles/header.css';
import '../styles/dialog.css';
import settingsIcon from '../icons/settings.svg';
import statsIcon from '../icons/stats.svg';
import { StatsDialog } from './statsDialog';
import { SettingsDialog } from './settingsDialog';
import { useState } from 'react';

export const Header = () => {

    const [ displayStats, setDisplayStats ] = useState(false);
    const [ displaySettings, setDisplaySettings ] = useState(false);

    const handleStatsClick = () => {
        setDisplayStats(true);
    }

    const handleSettingsClick = () => {
        setDisplaySettings(true);
    }

    return (
        <div className="Header">
            <div className="HeaderTitle">Decodle</div>
            <div className="HeaderButtons">
                <img src={statsIcon} alt="Stats" className='Gray-svg StatsButton noSelect' onClick={() => handleStatsClick()}/>
                <img src={settingsIcon} alt="Settings" className='Gray-svg SettingsButton noSelect' onClick={() => handleSettingsClick()}/>
            </div>
            { displayStats && <StatsDialog onClose={() => setDisplayStats(false)}/> }
            { displaySettings && <SettingsDialog onClose={() => setDisplaySettings(false)}/> }
        </div>
    );
}