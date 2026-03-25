import React from 'react';
import WorkBox from '../Workbox';
import SelfPortrait from '../../../Icons/selfportrait.png'
import SelfPortraitGif from '../../../Icons/selfportrait.gif'

function SelfPortraitPreview ({opacityEffect}) {
    return (
        <WorkBox 
            title="self portrait"
            body=""
            image={SelfPortrait}
            hoverImage={SelfPortraitGif}
            header=""
            skillsUsed=""
            imageHeight='40vh'
            aspectRatio='5 / 3'
            delayAppearance='1s'
            opacityEffect={opacityEffect}
            underDevelopment={false}
            link="/art/piece/self-portrait"
        />
    )
}

export default SelfPortraitPreview