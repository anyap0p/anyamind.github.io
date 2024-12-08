import React from 'react';
import WorkBox from './Workbox';
import SoilSurveyPhoto from '../../Icons/altseeingi.gif'
import SoilSurveyGif from '../../Icons/altseeingi.gif'

function SoilSurveyToolPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="Soil Survey Tool"
            body="Instantly analyze soil data for a potential solar farm site."
            image={SoilSurveyPhoto}
            hoverImage={SoilSurveyGif}
            header="TECH STACK"
            skillsUsed="Salesforce API, Google Maps SDK, USDA Soil Survey API"
            imageHeight='60vh'
            delayAppearance='5s'
            underDevelopment={false}
            opacityEffect={opacityEffect}
            aspectRatio='4 / 3'
        />
    )
}

export default SoilSurveyToolPreview