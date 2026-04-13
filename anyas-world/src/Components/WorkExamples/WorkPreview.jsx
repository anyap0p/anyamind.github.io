import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Arrow from '../Arrow'
import './Work.css';

import KikisLobbyPreview from './Thumbnails/KikisLobbyPreview';
import OnAWalk from './Thumbnails/OnAWalkPreview'
import SoapBraceletPreview from './Thumbnails/SoapBraceletPreview';

function WorkExamples () {

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Function to toggle popup visibility
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div style={{width: '100%', height: 'fit-content', backgroundColor: '#CCE8E8ff'}}>
            <HashLink to="#work-examples" className='see-my-work' style={{'animationDuration': '0.5s'}}> view my work </HashLink>
            <Arrow></Arrow>
            <sticky-grid>
                <div id='work-examples' className='work-column-left'>
                    <KikisLobbyPreview opacityEffect={true} />
                    <OnAWalk opacityEffect={true}/>
                </div>
                <div className='work-column-right'>
                    <SoapBraceletPreview opacityEffect={true}/>
                    <Link to='/work' className='see-more-work'>
                        see more work
                    </Link>
                </div>
            </sticky-grid>
        </div>
    )
}

export default WorkExamples