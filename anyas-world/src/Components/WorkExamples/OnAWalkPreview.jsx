import React from 'react';
import WorkBox from './Workbox';
import OnAWalk from '../../Icons/onawalk.png'
import OnAWalkGif from '../../Icons/onawalk.gif'

function OnAWalkPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="on a walk"
            body=""
            image={OnAWalk}
            hoverImage={OnAWalkGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='5 / 4'
            delayAppearance='5s'
            underDevelopment={false}
            opacityEffect={opacityEffect}
        />
    )
}

export default OnAWalkPreview