import React from 'react';
import WorkBox from '../Workbox';
import '../Work.css';
import Beast from '../../../Icons/beast.png';
import BeastGif from '../../../Icons/beast.gif';

function BeastPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="beast"
            body=""
            image={Beast}
            hoverImage={BeastGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='5 / 4'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default BeastPreview