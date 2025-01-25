import React from 'react';
import WorkBox from './Workbox';
import SoapBraceletImage from '../../Icons/thePassionOfSoapBracelet.jpg'
import AdvGif from '../../Icons/altseeingi.gif'

function SoapBraceletPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="the passion of soap bracelet"
            body=""
            image={SoapBraceletImage}
            hoverImage={SoapBraceletImage}
            header=""
            skillsUsed=""
            delayAppearance='2s'
            opacityEffect={opacityEffect}
            imageHeight='40vh'
            aspectRatio='1 / 1'
        />
    )
}

export default SoapBraceletPreview