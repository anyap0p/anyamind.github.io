import React from 'react';
import WorkBox from './Workbox';
import OnAWalk from '../../Icons/onawalk.png'
import SoilSurveyGif from '../../Icons/altseeingi.gif'

function SoilSurveyToolPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="on a walk"
            body=""
            image={OnAWalk}
            hoverImage={OnAWalk}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='3 / 4'
            delayAppearance='5s'
            underDevelopment={false}
            opacityEffect={opacityEffect}
        />
    )
}

export default SoilSurveyToolPreview