import React , { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Arrow from '../Arrow'
import './Work.css';

import KikisLobbyPreview from './KikisLobbyPreview';
import OnAWalk from './OnAWalkPreview'
import SoapBraceletPreview from './SoapBraceletPreview';

function WorkExamples () {

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Function to toggle popup visibility
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div style={{width: '100%', height: 'fit-content', backgroundColor: '#CCE8E8ff'}}>
            <Link to="#work-examples" className='see-my-work' style={{'animationDuration': '0.5s'}}> view my work </Link>
            <Arrow></Arrow>
            <sticky-grid>
                <div id='work-examples' className='work-column-left'>
                    <KikisLobbyPreview opacityEffect={true} />
                    <OnAWalk opacityEffect={true}/>
                </div>
                <div className='work-column-right'>
                    <SoapBraceletPreview opacityEffect={true}/>
                    <a href='/#/work' className='see-more-work'>
                        see more work
                    </a>
                </div>
            </sticky-grid>
        </div>
    )
}

export default WorkExamples