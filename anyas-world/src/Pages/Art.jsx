import React from 'react';
import NavigationBar from '../Components/NavigationBar'

import '../Components/WorkExamples/Work.css';

import KikisLobbyPreview from '../Components/WorkExamples/KikisLobbyPreview';
import HawkEyePreview from '../Components/WorkExamples/HawkEyePreview';
import MusicNotifBotPreview from '../Components/WorkExamples/MusicNotifBotPreview'
import SoapBracelet from '../Components/WorkExamples/SoapBracelet';
import ConnectFourPreview from '../Components/WorkExamples/ConnectFourPreview';
import OnAWalkPreview from '../Components/WorkExamples/OnAWalkPreview';


function Art () {
    return (
        <div class="page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <sticky-grid-2>
                <div id='work-examples' className='work-column-1'>
                    <KikisLobbyPreview opacityEffect={false} />
                </div>
                <div className='work-column-2'>
                    <SoapBracelet opacityEffect={false} />
                </div>
                <div className='work-column-3'>
                    <OnAWalkPreview opacityEffect={false} />
                </div>
            </sticky-grid-2>
        </div>
    )
}

export default Art