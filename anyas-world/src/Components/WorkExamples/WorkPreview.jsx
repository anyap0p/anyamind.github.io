import React , { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Arrow from '../Arrow'
import './Work.css';

import TuneMeInPreview from './TuneMeInPreview';
import HawkEyePreview from './HawkEyePreview';
import MusicNotifBotPreview from './MusicNotifBotPreview'
import AttackDiffPurePreview from './AttackDiffPurePreview';
import ConnectFourPreview from './ConnectFourPreview';

function WorkExamples () {

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Function to toggle popup visibility
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div style={{width: '100%', height: 'fit-content', backgroundColor: '#CCE8E8ff'}}>
            {/* <Link to="#work-examples" className='see-my-work' style={{'animationDuration': '0.5s'}}> view my work </Link>
            <Arrow></Arrow>
            <sticky-grid>
                <div id='work-examples' className='work-column-left'>
                    <TuneMeInPreview opacityEffect={true} />
                    <HawkEyePreview opacityEffect={true}/>
                    <MusicNotifBotPreview opacityEffect={true}/>
                </div>
                <div className='work-column-right'>
                    <p className='selected-works' onClick={togglePopup}>
                        Selected <span style={{textDecoration: 'line-through'}}>Ambient</span> Technical Works 20-23
                    </p>
                    <AttackDiffPurePreview opacityEffect={true}/>
                    <ConnectFourPreview opacityEffect={true}/>
                    <a href='/#/work' className='see-more-work'>
                        see more work
                    </a>
                </div>
            </sticky-grid>
            {isPopupVisible && (
                <div className="selected-works-popup">
                    <img className='album-cover-container' src={SAWCover} alt=""></img>
                    <text className='music-text'>BOO! Music player soon...</text>
                </div>
            )} */}
        </div>
    )
}

export default WorkExamples