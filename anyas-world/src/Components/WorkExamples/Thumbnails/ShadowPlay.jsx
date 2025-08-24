import React from 'react';
import WorkBox from '../Workbox';
import ShadowPlay from '../../../Icons/shadowplay.png';
import ShadowPlayGif from '../../../Icons/shadowplay.gif';

function ShadowPlayPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="shadow play"
            body=""
            image={ShadowPlay}
            hoverImage={ShadowPlayGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='3 / 1'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={true}
        />
    )
}

export default ShadowPlayPreview