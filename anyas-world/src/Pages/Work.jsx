import React from 'react';

import '../Components/WorkExamples/Work.css';

import TuneMeInPreview from '../Components/WorkExamples/TuneMeInPreview';
import HawkEyePreview from '../Components/WorkExamples/HawkEyePreview';
import MusicNotifBotPreview from '../Components/WorkExamples/MusicNotifBotPreview'
import AttackDiffPurePreview from '../Components/WorkExamples/AttackDiffPurePreview';
import ConnectFourPreview from '../Components/WorkExamples/ConnectFourPreview';
import SoilSurveyToolPreview from '../Components/WorkExamples/SoilSurveyToolPreview';

import NavigationBar from '../Components/NavigationBar'
import SocialsBar from '../Components/Socials'

function Work () {
    return (
        <div class="page">
            <NavigationBar
                jumpAnimation={false}
                moveInAnimation={false}
            />
            <SocialsBar animate={false}></SocialsBar>
            <sticky-grid-2>
                {/* <div id='work-examples' className='work-column-1'>
                    <TuneMeInPreview opacityEffect={false} />
                    <AttackDiffPurePreview opacityEffect={false} />
                </div>
                <div className='work-column-2'>
                    <SoilSurveyToolPreview opacityEffect={false} />
                    <MusicNotifBotPreview opacityEffect={false} />
                </div>
                <div className='work-column-3'>
                    <ConnectFourPreview opacityEffect={false} />
                    <HawkEyePreview opacityEffect={false} />
                </div> */}
            </sticky-grid-2>
        </div>
    )
}

export default Work